import { body, validationResult } from 'express-validator';
import { Subject, BRANCHES, SEMESTERS } from '../models/Subject.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const subjectValidation = [
  body('name').trim().notEmpty().withMessage('Subject name is required'),
  body('code').trim().notEmpty().withMessage('Subject code is required'),
  body('branch').isIn(BRANCHES).withMessage('Invalid branch'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8'),
];

const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw errors;
};

export const getSubjects = asyncHandler(async (req, res) => {
  const { branch, semester } = req.query;
  const filter = { isActive: true };
  if (branch) filter.branch = branch;
  if (semester) filter.semester = Number(semester);

  const subjects = await Subject.find(filter).sort({ semester: 1, name: 1 });

  res.json({ success: true, data: { subjects, branches: BRANCHES, semesters: SEMESTERS } });
});

export const createSubject = asyncHandler(async (req, res) => {
  validate(req);

  const subject = await Subject.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: { subject } });
});

export const updateSubject = asyncHandler(async (req, res) => {
  validate(req);

  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!subject) throw new AppError('Subject not found', 404);
  res.json({ success: true, data: { subject } });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!subject) throw new AppError('Subject not found', 404);
  res.json({ success: true, message: 'Subject deactivated' });
});
