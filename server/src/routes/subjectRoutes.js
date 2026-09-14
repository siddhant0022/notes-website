import { Router } from 'express';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  subjectValidation,
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getSubjects);
router.post('/', protect, authorize('Admin'), subjectValidation, createSubject);
router.put('/:id', protect, authorize('Admin'), subjectValidation, updateSubject);
router.delete('/:id', protect, authorize('Admin'), deleteSubject);

export default router;
