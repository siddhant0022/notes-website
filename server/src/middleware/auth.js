import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { extractToken, verifyToken } from '../utils/jwt.js';

/**
 * Validates JWT from HttpOnly cookie or Authorization header.
 * Attaches decoded user payload to req.user.
 */
export const protect = async (req, _res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new AppError('Invalid or expired token. Please log in again.', 401);
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Contact admin.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth — attaches user if token valid, continues otherwise.
 */
export const optionalAuth = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user?.isActive) req.user = user;
    next();
  } catch {
    next();
  }
};

/**
 * Role-Based Access Control middleware factory.
 * @param  {...string} roles - Allowed roles (e.g. 'Admin', 'Student')
 */
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(`Role '${req.user.role}' is not authorized for this action.`, 403)
    );
  }

  next();
};

/**
 * Ensures resource owner or admin can modify.
 */
export const ownerOrAdmin = (getOwnerId) => (req, _res, next) => {
  const ownerId = typeof getOwnerId === 'function' ? getOwnerId(req) : getOwnerId;

  if (req.user.role === 'Admin') return next();

  if (req.user._id.toString() !== ownerId?.toString()) {
    return next(new AppError('You can only modify your own resources.', 403));
  }

  next();
};
