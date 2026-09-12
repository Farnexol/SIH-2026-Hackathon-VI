import User from '../models/User.js';
import {
  getUserCompetencies,
  getUserPriorityGaps
} from '../services/competencyService.js';
import { getUserLearningPath } from '../services/learningPathService.js';
import { sendSuccess } from '../utils/responseHandler.js';

// @desc    Get aggregated dashboard summary
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const competencies = await getUserCompetencies(req.user._id);
    const priorityGaps = await getUserPriorityGaps(req.user._id);
    const learningPath = await getUserLearningPath(req.user._id);

    // AI Insight generation based on actual user state & priority gaps
    const isUnassessed = (user.stats?.overallCompetency === 0 || !user.stats?.overallCompetency) &&
      (user.stats?.assessmentScore === 0 || !user.stats?.assessmentScore);

    const biggestGap = priorityGaps[0] || { title: 'Python for Data Analysis', current: 0, required: 80, gap: 80 };
    const secondGap = priorityGaps[1] || { title: 'Data Analysis', current: 0, required: 75, gap: 75 };

    const aiInsight = {
      headline: isUnassessed
        ? 'Baseline Diagnostic Assessment Required for Official Cadre Calibration'
        : `Your biggest current competency gap is ${biggestGap.title} & ${secondGap.title}.`,
      advisorRationale: isUnassessed
        ? `Welcome to the Official Statistical System Platform. As a newly registered ${user.designation} in the ${user.department}, completing your diagnostic assessment will establish your baseline competency matrix and calibrate your personalized curriculum.`
        : `Based on your role as ${user.designation} in ${user.department}, closing your ${biggestGap.gap}% gap in ${biggestGap.title} is critical for automated tabulation and official survey dissemination.`,
      currentLevel: isUnassessed ? 0 : biggestGap.current,
      requiredBenchmark: biggestGap.required || 80,
      deficit: isUnassessed ? -80 : -biggestGap.gap,
      recommendedNextSteps: learningPath.steps.slice(0, 4).map((s, idx) => ({
        step: idx + 1,
        title: s.title,
        status: s.status
      })),
      actionButtonText: isUnassessed ? 'Take Initial Diagnostic' : 'Continue Learning Path',
      actionRoute: isUnassessed ? '/quiz/quiz-201' : '/learning-path'
    };

    const nextStep = learningPath.steps.find((s) => s.status === 'In Progress')
      || learningPath.steps.find((s) => s.status === 'Not Started')
      || learningPath.steps[0];

    const learningPathSummary = {
      target: learningPath.competencyTarget,
      progress: learningPath.overallProgress || 0,
      nextStep: nextStep ? {
        id: nextStep.id,
        title: nextStep.title,
        duration: nextStep.duration,
        description: nextStep.description,
        status: nextStep.status
      } : null
    };

    const payload = {
      user,
      stats: user.stats,
      aiInsight,
      priorityGaps,
      competencies,
      learningPathSummary
    };

    return sendSuccess(res, payload, 'Dashboard telemetry retrieved');
  } catch (error) {
    next(error);
  }
};
