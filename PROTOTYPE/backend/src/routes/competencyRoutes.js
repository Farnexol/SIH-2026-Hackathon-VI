import express from 'express';
import {
  getCompetencies,
  getCompetencyById,
  getPriorityGaps
} from '../controllers/competencyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCompetencies);
router.get('/gaps', protect, getPriorityGaps);
router.get('/:id', protect, getCompetencyById);

export default router;
