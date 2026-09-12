import express from 'express';
import { askAdvisor } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/advisor', protect, askAdvisor);

export default router;
