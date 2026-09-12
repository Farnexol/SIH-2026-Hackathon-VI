import express from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/responseHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return sendSuccess(res, {
    status: 'online',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  }, 'API is running');
});

export default router;
