import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.js';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw errors;
  }
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = signToken({ id: user._id, role: user.role });
  setTokenCookie(res, token);

  res.status(statusCode).json({
    success: true,
    message: statusCode === 201 ? 'Account created successfully' : 'Logged in successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  validate(req);

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError('Email already registered', 422, [
      { field: 'email', message: 'Email already registered' },
    ]);
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  validate(req);

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendAuthResponse(res, user);
});

export const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('starredResources', '_id');
  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        starredResources: user.starredResources.map((r) => r._id.toString()),
      },
    },
  });
});
