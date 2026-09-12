import express from 'express';
import {
  getMaterials,
  uploadMaterial,
  analyzeMaterial
} from '../controllers/materialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getMaterials);
router.post('/upload', protect, upload.single('file'), uploadMaterial);
router.post('/:id/analyze', protect, analyzeMaterial);

export default router;
