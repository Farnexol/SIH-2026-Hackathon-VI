import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResult,
  generateQuizFromMaterial
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getQuizzes);
router.post('/generate', protect, generateQuizFromMaterial);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/result', protect, getQuizResult);

export default router;
