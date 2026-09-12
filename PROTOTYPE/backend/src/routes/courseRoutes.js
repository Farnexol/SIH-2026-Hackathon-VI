import express from 'express';
import {
  getCourses,
  getCourseById,
  getRecommendedOnly,
  enrollCourse,
  updateProgress
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/recommended', protect, getRecommendedOnly);
router.get('/:id', protect, getCourseById);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/progress', protect, updateProgress);

export default router;
