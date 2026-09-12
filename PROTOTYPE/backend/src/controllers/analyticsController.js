import QuizAttempt from '../models/QuizAttempt.js';
import { getUserCompetencies, getUserPriorityGaps } from '../services/competencyService.js';
import { sendSuccess } from '../utils/responseHandler.js';

// @desc    Get longitudinal analytics & cadre growth metrics
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req, res, next) => {
  try {
    const competencies = await getUserCompetencies(req.user._id);
    const priorityGaps = await getUserPriorityGaps(req.user._id);

    // Fetch user assessment history from real QuizAttempts
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Use only real attempts taken by this authenticated officer
    const assessmentHistory = attempts.map((a, i) => ({
      id: a._id,
      title: a.quizTitle,
      date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: a.scorePercentage,
      competency: a.competencyDelta?.competencyName || 'Data Analysis'
    }));

    // Radar chart dataset matching 7 competencies
    const radarData = competencies.map((c) => {
      let subject = c.name;
      if (c.name.includes('Python')) subject = 'Python';
      else if (c.name.includes('Visualization')) subject = 'Data Viz';
      else if (c.name.includes('Computing')) subject = 'Stat Computing';
      else if (c.name.includes('Survey')) subject = 'Survey Design';
      else if (c.name.includes('Interpretation')) subject = 'Interpretation';

      return {
        subject,
        current: c.currentScore,
        required: c.requiredScore,
        fullMark: 100
      };
    });

    const strengths = competencies
      .filter((c) => c.level === 'Strong')
      .map((c) => ({
        name: c.name,
        score: c.currentScore,
        badge: 'Strong'
      }));

    const areasToImprove = priorityGaps.map((g) => ({
      name: g.title,
      current: g.current,
      required: g.required,
      gap: g.gap,
      priority: g.priority
    }));

    const isDemo = req.user.email === 'demo@statiq.ai';

    const compScores = {};
    competencies.forEach((c) => {
      compScores[c.name] = c.currentScore;
    });

    // Longitudinal growth telemetry: realistic for new vs demo user
    const competencyGrowth = isDemo
      ? [
          { month: 'Oct 2025', Statistics: 72, DataAnalysis: 48, Python: 22, DataViz: 38, SurveyMethod: 70 },
          { month: 'Nov 2025', Statistics: 75, DataAnalysis: 50, Python: 25, DataViz: 40, SurveyMethod: 72 },
          { month: 'Dec 2025', Statistics: 78, DataAnalysis: 54, Python: 30, DataViz: 42, SurveyMethod: 74 },
          { month: 'Jan 2026', Statistics: 80, DataAnalysis: 56, Python: 34, DataViz: 45, SurveyMethod: 75 },
          { month: 'Feb 2026', Statistics: 82, DataAnalysis: 60, Python: 36, DataViz: 46, SurveyMethod: 75 },
          { month: 'Mar 2026', Statistics: 84, DataAnalysis: 68, Python: 38, DataViz: 48, SurveyMethod: 76 }
        ]
      : [
          {
            month: 'Baseline',
            Statistics: 0,
            DataAnalysis: 0,
            Python: 0,
            DataViz: 0,
            SurveyMethod: 0
          },
          {
            month: 'Current',
            Statistics: compScores['Statistics'] || 0,
            DataAnalysis: compScores['Data Analysis'] || 0,
            Python: compScores['Python for Data Analysis'] || 0,
            DataViz: compScores['Data Visualization'] || 0,
            SurveyMethod: compScores['Survey Methodology'] || 0
          }
        ];

    const weeklyLearningHours = isDemo
      ? [
          { day: 'Mon', hours: 2.5 },
          { day: 'Tue', hours: 1.8 },
          { day: 'Wed', hours: 3.2 },
          { day: 'Thu', hours: 2.0 },
          { day: 'Fri', hours: 4.1 },
          { day: 'Sat', hours: 5.0 },
          { day: 'Sun', hours: 3.5 }
        ]
      : [
          { day: 'Mon', hours: 0 },
          { day: 'Tue', hours: 0 },
          { day: 'Wed', hours: 0 },
          { day: 'Thu', hours: 0 },
          { day: 'Fri', hours: 0 },
          { day: 'Sat', hours: 0 },
          { day: 'Sun', hours: Number(req.user.stats?.learningHoursTotal || 0) }
        ];

    const totalWeeklyHours = weeklyLearningHours.reduce((acc, curr) => acc + curr.hours, 0);

    const analyticsPayload = {
      competencyGrowth,
      weeklyLearningHours,
      totalWeeklyHours: Number(totalWeeklyHours.toFixed(1)),
      assessmentHistory,
      radarData,
      strengths,
      areasToImprove
    };

    return sendSuccess(res, analyticsPayload, 'Learner analytics aggregated');
  } catch (error) {
    next(error);
  }
};
