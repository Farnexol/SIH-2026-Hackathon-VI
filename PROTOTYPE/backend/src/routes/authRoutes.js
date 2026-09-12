import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  getNextId
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/next-id', getNextId);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
