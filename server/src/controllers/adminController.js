import { Resource } from '../models/Resource.js';
import { User } from '../models/User.js';
import { Subject } from '../models/Subject.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const populateFields = [
  { path: 'subject', select: 'name code' },
  { path: 'uploadedBy', select: 'name email' },
];

export const getStats = asyncHandler(async (_req, res) => {
  const [totalResources, pendingResources, totalUsers, totalSubjects, totalDownloads] =
    await Promise.all([
      Resource.countDocuments({ status: 'approved' }),
      Resource.countDocuments({ status: 'pending' }),
      User.countDocuments({ isActive: true }),
      Subject.countDocuments({ isActive: true }),
      Resource.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
    ]);

  const recentUploads = await Resource.find()
    .populate(populateFields)
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      stats: {
        totalResources,
        pendingResources,
        totalUsers,
        totalSubjects,
        totalDownloads: totalDownloads[0]?.total || 0,
      },
      recentUploads,
    },
  });
});

export const getPendingResources = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [resources, total] = await Promise.all([
    Resource.find({ status: 'pending' })
      .populate(populateFields)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Resource.countDocuments({ status: 'pending' }),
  ]);

  res.json({
    success: true,
    data: { resources, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const approveResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      status: 'approved',
      moderatedBy: req.user._id,
      moderatedAt: new Date(),
      rejectionReason: null,
    },
    { new: true }
  ).populate(populateFields);

  if (!resource) throw new AppError('Resource not found', 404);

  res.json({ success: true, message: 'Resource approved', data: { resource } });
});

export const rejectResource = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      status: 'rejected',
      moderatedBy: req.user._id,
      moderatedAt: new Date(),
      rejectionReason: reason || 'Does not meet guidelines',
    },
    { new: true }
  ).populate(populateFields);

  if (!resource) throw new AppError('Resource not found', 404);

  res.json({ success: true, message: 'Resource rejected', data: { resource } });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const updates = {};
  if (role !== undefined) updates.role = role;
  if (isActive !== undefined) updates.isActive = isActive;

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw new AppError('User not found', 404);

  if (req.params.id === req.user._id.toString() && isActive === false) {
    throw new AppError('Cannot deactivate your own account', 403);
  }

  res.json({ success: true, data: { user } });
});
