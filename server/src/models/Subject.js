import mongoose from 'mongoose';

const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'AIML', 'CSIT'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [120, 'Subject name cannot exceed 120 characters'],
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Subject code cannot exceed 20 characters'],
    },
    branch: {
      type: String,
      enum: BRANCHES,
      required: [true, 'Branch is required'],
    },
    semester: {
      type: Number,
      enum: SEMESTERS,
      required: [true, 'Semester is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ branch: 1, semester: 1 });
subjectSchema.index({ code: 1, branch: 1 }, { unique: true });

export const Subject = mongoose.model('Subject', subjectSchema);
export { BRANCHES, SEMESTERS };
