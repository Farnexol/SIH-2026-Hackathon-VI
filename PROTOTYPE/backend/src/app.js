import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import competencyRoutes from './routes/competencyRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { notFound } from './middleware/notFoundMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StatIQ Official Statistical Capacity Building API is active',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/competencies', competencyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz', quizRoutes); // Alias for frontend compatibility with /api/quiz
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// 404 & centralized error handlers (attached after route registration)
export const attachErrorHandlers = () => {
  app.use(notFound);
  app.use(errorHandler);
};

export default app;
