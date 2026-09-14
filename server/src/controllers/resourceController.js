import { Resource } from '../models/Resource.js';
import { User } from '../models/User.js';
import { Subject } from '../models/Subject.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../config/multer.js';

const populateFields = [
  { path: 'subject', select: 'name code branch semester' },
  { path: 'uploadedBy', select: 'name email' },
];

export const getPublicStats = asyncHandler(async (_req, res) => {
  const [totalResources, totalUsers, totalDownloads] = await Promise.all([
    Resource.countDocuments({ status: 'approved' }),
    User.countDocuments({ isActive: true }),
    Resource.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalResources,
      totalUsers,
      totalDownloads: totalDownloads[0]?.total || 0,
    },
  });
});

export const getResources = asyncHandler(async (req, res) => {
  const {
    branch,
    semester,
    subject,
    type,
    search,
    page = 1,
    limit = 12,
    status,
  } = req.query;

  const filter = {};

  if (req.user?.role === 'Admin' && status) {
    filter.status = status;
  } else {
    filter.status = 'approved';
  }

  if (branch) filter.branch = branch;
  if (semester) filter.semester = Number(semester);
  if (subject) filter.subject = subject;
  if (type) filter.type = type;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .populate(populateFields)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Resource.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { resources, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id).populate(populateFields);

  if (!resource) throw new AppError('Resource not found', 404);

  const isAdmin = req.user?.role === 'Admin';
  const isOwner = req.user?._id?.toString() === resource.uploadedBy?._id?.toString();

  if (resource.status !== 'approved' && !isAdmin && !isOwner) {
    throw new AppError('Resource not found', 404);
  }

  res.json({ success: true, data: { resource } });
});

export const uploadResource = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('PDF file is required', 422);

  const { title, description, type, branch, semester, subject, tags } = req.body;

  if (subject) {
    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) throw new AppError('Subject not found', 404);
  }

  const resource = await Resource.create({
    title,
    description: description || '',
    type,
    branch,
    semester: Number(semester),
    ...(subject ? { subject } : {}),
    fileUrl: `/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    uploadedBy: req.user._id,
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    status: req.user.role === 'Admin' ? 'approved' : 'pending',
  });

  await resource.populate(populateFields);

  res.status(201).json({
    success: true,
    message:
      req.user.role === 'Admin'
        ? 'Resource uploaded and published'
        : 'Resource uploaded — pending admin approval',
    data: { resource },
  });
});

export const downloadResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) throw new AppError('Resource not found', 404);

  const isAdmin = req.user?.role === 'Admin';
  const isOwner = req.user?._id?.toString() === resource.uploadedBy?.toString();

  if (resource.status !== 'approved' && !isAdmin && !isOwner) {
    throw new AppError('Resource not found', 404);
  }

  const filePath = path.join(UPLOAD_DIR, path.basename(resource.fileUrl));

  if (!fs.existsSync(filePath)) {
    throw new AppError('File not found on server', 404);
  }

  resource.downloadCount += 1;
  await resource.save({ validateBeforeSave: false });

  res.download(filePath, resource.fileName);
});

export const toggleStar = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) throw new AppError('Resource not found', 404);
  if (resource.status !== 'approved') throw new AppError('Cannot star unapproved resource', 403);

  const user = await User.findById(req.user._id);
  const resourceId = resource._id.toString();
  const isStarred = user.starredResources.some((id) => id.toString() === resourceId);

  if (isStarred) {
    user.starredResources = user.starredResources.filter((id) => id.toString() !== resourceId);
    resource.starCount = Math.max(0, resource.starCount - 1);
  } else {
    user.starredResources.push(resource._id);
    resource.starCount += 1;
  }

  await Promise.all([user.save(), resource.save({ validateBeforeSave: false })]);

  res.json({
    success: true,
    message: isStarred ? 'Resource unstarred' : 'Resource starred',
    data: { starred: !isStarred, starCount: resource.starCount },
  });
});

export const getStarredResources = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'starredResources',
    populate: populateFields,
    match: { status: 'approved' },
  });

  res.json({
    success: true,
    data: { resources: user.starredResources.filter(Boolean) },
  });
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) throw new AppError('Resource not found', 404);

  const isAdmin = req.user.role === 'Admin';
  const isOwner = req.user._id.toString() === resource.uploadedBy.toString();

  if (!isAdmin && !isOwner) {
    throw new AppError('Not authorized to delete this resource', 403);
  }

  const filePath = path.join(UPLOAD_DIR, path.basename(resource.fileUrl));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await User.updateMany(
    { starredResources: resource._id },
    { $pull: { starredResources: resource._id } }
  );

  await resource.deleteOne();

  res.json({ success: true, message: 'Resource deleted' });
});
