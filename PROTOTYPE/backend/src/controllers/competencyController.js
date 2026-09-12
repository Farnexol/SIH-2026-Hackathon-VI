import {
  getUserCompetencies,
  getUserPriorityGaps
} from '../services/competencyService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all competencies for authenticated user
// @route   GET /api/competencies
// @access  Private
export const getCompetencies = async (req, res, next) => {
  try {
    const list = await getUserCompetencies(req.user._id);
    return sendSuccess(res, list, 'Competency matrix retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific competency by code or ID
// @route   GET /api/competencies/:id
// @access  Private
export const getCompetencyById = async (req, res, next) => {
  try {
    const list = await getUserCompetencies(req.user._id);
    const found = list.find((c) => c.id === req.params.id || c._id.toString() === req.params.id);

    if (!found) {
      return sendError(res, `Competency with id ${req.params.id} not found`, 404);
    }

    return sendSuccess(res, found, 'Competency details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Get prioritized competency gaps
// @route   GET /api/competencies/gaps
// @access  Private
export const getPriorityGaps = async (req, res, next) => {
  try {
    const gaps = await getUserPriorityGaps(req.user._id);
    return sendSuccess(res, gaps, 'Priority competency gaps retrieved');
  } catch (error) {
    next(error);
  }
};
