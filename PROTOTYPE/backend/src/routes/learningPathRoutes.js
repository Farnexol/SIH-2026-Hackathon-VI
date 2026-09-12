import express from 'express';
import {
  getLearningPath,
  generateLearningPath,
  updateStep
} from '../controllers/learningPathController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLearningPath);
router.post('/generate', protect, generateLearningPath);
router.put('/step/:stepId', protect, updateStep);

export default router;
