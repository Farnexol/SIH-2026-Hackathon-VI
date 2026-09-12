import {
  getUserLearningPath,
  initializeUserLearningPath
} from '../services/learningPathService.js';
import LearningPath from '../models/LearningPath.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get user's personalized learning path
// @route   GET /api/learning-path
// @access  Private
export const getLearningPath = async (req, res, next) => {
  try {
    const path = await getUserLearningPath(req.user._id);
    return sendSuccess(res, path, 'Personalized learning path retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate / recalibrate learning path
// @route   POST /api/learning-path/generate
// @access  Private
export const generateLearningPath = async (req, res, next) => {
  try {
    await LearningPath.deleteOne({ user: req.user._id });
    const freshPath = await initializeUserLearningPath(req.user._id);
    return sendSuccess(res, freshPath, 'Learning path generated based on competency gap priorities', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update step progress/status in learning path
// @route   PUT /api/learning-path/step/:stepId
// @access  Private
export const updateStep = async (req, res, next) => {
  try {
    const stepId = parseInt(req.params.stepId);
    const { status, progress, score } = req.body;

    const path = await LearningPath.findOne({ user: req.user._id });
    if (!path) {
      return sendError(res, 'Learning path not found', 404);
    }

    const step = path.steps.find((s) => s.id === stepId);
    if (!step) {
      return sendError(res, `Step ${stepId} not found in learning path`, 404);
    }

    if (status) step.status = status;
    if (progress !== undefined) step.progress = progress;
    if (score) step.score = score;
    if (status === 'Completed') {
      step.completedDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      // Unlock next step if locked
      const nextStep = path.steps.find((s) => s.id === stepId + 1);
      if (nextStep && nextStep.status === 'Locked') {
        nextStep.status = 'Not Started';
      }
    }

    await path.save();
    return sendSuccess(res, path, `Step ${stepId} updated`);
  } catch (error) {
    next(error);
  }
};
