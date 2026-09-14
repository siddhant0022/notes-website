import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  registerValidation,
  loginValidation,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
