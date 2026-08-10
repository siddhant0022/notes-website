import mongoose from 'mongoose';

const RESOURCE_TYPES = [
  'Class Notes',
  'AKTU PYQs',
  'Quantums',
  'Important Questions',
  'Lab Manuals',
];

const MODERATION_STATUS = ['pending', 'approved', 'rejected'];

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    type: {
      type: String,
      enum: RESOURCE_TYPES,
      required: [true, 'Resource type is required'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    pageCount: {
      type: Number,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: MODERATION_STATUS,
      default: 'pending',
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    moderatedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    starCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

resourceSchema.index({ branch: 1, semester: 1, type: 1 });
resourceSchema.index({ subject: 1 });
resourceSchema.index({ status: 1, createdAt: -1 });
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Resource = mongoose.model('Resource', resourceSchema);
export { RESOURCE_TYPES, MODERATION_STATUS };
