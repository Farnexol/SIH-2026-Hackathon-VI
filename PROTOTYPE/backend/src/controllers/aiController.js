import { getAdvisorResponse } from '../services/aiService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Ask AI Learning Advisor
// @route   POST /api/ai/advisor
// @access  Private
export const askAdvisor = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return sendError(res, 'Prompt text is required', 400);
    }

    const advisorResult = await getAdvisorResponse(prompt, {
      userId: req.user._id,
      designation: req.user.designation,
      department: req.user.department
    });

    return sendSuccess(res, advisorResult, 'Advisor guidance generated');
  } catch (error) {
    next(error);
  }
};
