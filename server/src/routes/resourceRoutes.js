import { Router } from 'express';
import {
  getPublicStats,
  getResources,
  getResourceById,
  uploadResource,
  downloadResource,
  toggleStar,
  getStarredResources,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/stats/public', getPublicStats);
router.get('/', optionalAuth, getResources);
router.get('/starred', protect, getStarredResources);
router.get('/:id', optionalAuth, getResourceById);
router.get('/:id/download', optionalAuth, downloadResource);

router.post('/', protect, upload.single('file'), uploadResource);
router.post('/:id/star', protect, toggleStar);
router.delete('/:id', protect, deleteResource);

export default router;
