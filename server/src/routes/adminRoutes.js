import { Router } from 'express';
import {
  getStats,
  getPendingResources,
  approveResource,
  rejectResource,
  getUsers,
  updateUser,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('Admin'));

router.get('/stats', getStats);
router.get('/resources/pending', getPendingResources);
router.patch('/resources/:id/approve', approveResource);
router.patch('/resources/:id/reject', rejectResource);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);

export default router;
