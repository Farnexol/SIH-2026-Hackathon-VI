import Competency from '../models/Competency.js';
import UserCompetency from '../models/UserCompetency.js';
import User from '../models/User.js';

/**
 * Deterministic Competency Gap Calculation Engine
 * gap = Math.max(0, requiredScore - currentScore)
 */
export const calculateGapAndLevel = (currentScore, requiredScore) => {
  const gap = Math.max(0, requiredScore - currentScore);

  let level = 'Needs Improvement';
  let priority = 'No Gap';

  if (currentScore >= requiredScore) {
    level = 'Strong';
    priority = 'No Gap';
  } else if (gap <= 15) {
    level = 'Moderate';
    priority = 'Low';
  } else if (gap <= 30) {
    level = 'Needs Improvement';
    priority = 'Medium';
  } else {
    level = 'Needs Improvement';
    priority = 'High';
  }

  return { gap, level, priority };
};

// Initial OSSF baseline competencies template
export const DEFAULT_COMPETENCIES = [
  {
    code: 'comp-1',
    name: 'Statistics',
    category: 'Core Statistical Foundations',
    defaultRequiredScore: 75,
    initialScore: 84,
    trend: '+4%',
    trendDirection: 'up',
    description: 'Probability theory, hypothesis testing, distributions, variance estimation, and inference.',
    assessmentsCompleted: 6,
    recommendedAction: 'Maintain mastery through advanced peer reviews',
    lastAssessed: '3 days ago'
  },
  {
    code: 'comp-2',
    name: 'Data Analysis',
    category: 'Statistical Processing',
    defaultRequiredScore: 75,
    initialScore: 62,
    trend: '+6%',
    trendDirection: 'up',
    description: 'Exploratory data analysis, correlation, regression models, multivariate methods, and weighting.',
    assessmentsCompleted: 4,
    recommendedAction: 'Complete Applied Regression on Survey Datasets',
    lastAssessed: 'Yesterday'
  },
  {
    code: 'comp-3',
    name: 'Python for Data Analysis',
    category: 'Statistical Computing',
    defaultRequiredScore: 80,
    initialScore: 38,
    trend: '-2%',
    trendDirection: 'down',
    description: 'Python scripting, Pandas for tabulations, NumPy vector calculations, micro-data cleaning.',
    assessmentsCompleted: 3,
    recommendedAction: 'Start Recommended Path: NumPy & Pandas for Official Statistics',
    lastAssessed: '5 days ago'
  },
  {
    code: 'comp-4',
    name: 'Data Visualization',
    category: 'Dissemination & Reporting',
    defaultRequiredScore: 75,
    initialScore: 48,
    trend: '+1%',
    trendDirection: 'up',
    description: 'Effective chart grammar, MoSPI indicator dashboards, geospatial maps, and publication charts.',
    assessmentsCompleted: 2,
    recommendedAction: 'Enroll in Official Indicators & Chart Standards',
    lastAssessed: '1 week ago'
  },
  {
    code: 'comp-5',
    name: 'Survey Methodology',
    category: 'Field Operations & Design',
    defaultRequiredScore: 70,
    initialScore: 76,
    trend: '+3%',
    trendDirection: 'up',
    description: 'Multi-stage stratified sampling, FSU selection, frame validation, and non-sampling error control.',
    assessmentsCompleted: 7,
    recommendedAction: 'Eligible for Mentor Certification in NSS Designs',
    lastAssessed: '2 weeks ago'
  },
  {
    code: 'comp-6',
    name: 'Statistical Computing',
    category: 'Statistical Computing',
    defaultRequiredScore: 70,
    initialScore: 55,
    trend: '+5%',
    trendDirection: 'up',
    description: 'Batch processing, automated tabulation algorithms, data cleaning pipelines, and macro scripts.',
    assessmentsCompleted: 4,
    recommendedAction: 'Practice automated tabulation workflows',
    lastAssessed: '4 days ago'
  },
  {
    code: 'comp-7',
    name: 'Data Interpretation',
    category: 'Core Statistical Foundations',
    defaultRequiredScore: 75,
    initialScore: 81,
    trend: '+2%',
    trendDirection: 'up',
    description: 'Official statistical brief drafting, indicator contextualization, metadata adherence, and trend scrutiny.',
    assessmentsCompleted: 5,
    recommendedAction: 'Maintain mastery through National Accounts briefing papers',
    lastAssessed: '1 week ago'
  }
];

// Initialize baseline competencies for user
export const initializeUserCompetencies = async (userId) => {
  const user = await User.findById(userId);
  const isDemo = user?.email === 'demo@statiq.ai';

  for (const item of DEFAULT_COMPETENCIES) {
    let comp = await Competency.findOne({ code: item.code });
    if (!comp) {
      comp = await Competency.create({
        code: item.code,
        name: item.name,
        category: item.category,
        description: item.description,
        defaultRequiredScore: item.defaultRequiredScore,
        recommendedActionDefault: item.recommendedAction
      });
    }

    const currentScore = isDemo ? item.initialScore : 0;
    const requiredScore = item.defaultRequiredScore;
    const { gap, level, priority } = isDemo
      ? calculateGapAndLevel(item.initialScore, requiredScore)
      : { gap: requiredScore, level: 'Needs Improvement', priority: 'High' };

    await UserCompetency.findOneAndUpdate(
      { user: userId, competency: comp._id },
      {
        user: userId,
        competency: comp._id,
        code: item.code,
        name: item.name,
        category: item.category,
        currentScore,
        requiredScore,
        gap,
        level,
        priority,
        trend: isDemo ? item.trend : '--',
        trendDirection: isDemo ? item.trendDirection : 'neutral',
        description: item.description,
        assessmentsCompleted: isDemo ? item.assessmentsCompleted : 0,
        recommendedAction: isDemo ? item.recommendedAction : 'Complete initial diagnostic assessment to establish baseline',
        lastAssessed: isDemo ? item.lastAssessed : 'Not assessed yet'
      },
      { upsert: true, new: true }
    );
  }
};

// Retrieve all user competencies mapped to frontend format
export const getUserCompetencies = async (userId) => {
  let list = await UserCompetency.find({ user: userId }).sort({ code: 1 });

  if (!list || list.length === 0) {
    await initializeUserCompetencies(userId);
    list = await UserCompetency.find({ user: userId }).sort({ code: 1 });
  }

  return list.map((c) => ({
    id: c.code,
    _id: c._id,
    name: c.name,
    category: c.category,
    currentScore: c.currentScore,
    requiredScore: c.requiredScore,
    gap: c.gap,
    level: c.level,
    priority: c.priority,
    trend: c.trend,
    trendDirection: c.trendDirection,
    description: c.description,
    assessmentsCompleted: c.assessmentsCompleted,
    recommendedAction: c.recommendedAction,
    lastAssessed: c.lastAssessed
  }));
};

// Get priority gaps formatted for dashboard & recommendation cards
export const getUserPriorityGaps = async (userId) => {
  const competencies = await getUserCompetencies(userId);

  const gaps = competencies
    .filter((c) => c.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .map((c, index) => {
      let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
      let buttonText = 'Improve Skill';
      let route = `/courses?competency=${encodeURIComponent(c.name)}`;

      if (c.priority === 'High') {
        badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
        buttonText = 'View Learning Path';
        route = '/learning-path';
      } else if (c.priority === 'Medium') {
        badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
        buttonText = 'View Recommendations';
        route = `/courses?competency=${encodeURIComponent(c.name)}`;
      }

      let context = 'Directly impacts official statistical output and national indicator reporting.';
      if (c.name.includes('Python')) {
        context = 'Directly impacts automated tabulation for PLFS and ASI micro-data files.';
      } else if (c.name.includes('Visualization')) {
        context = 'Essential for preparing quarterly statistical bulletins and infographics.';
      } else if (c.name.includes('Computing')) {
        context = 'Enhances execution speed for national index aggregations.';
      }

      return {
        id: `gap-${index + 1}`,
        competencyId: c.id,
        title: c.name,
        current: c.currentScore,
        required: c.requiredScore,
        gap: c.gap,
        priority: c.priority,
        badgeColor,
        buttonText,
        route,
        context
      };
    });

  return gaps;
};

// Update competency score dynamically after quiz evaluation
export const updateUserCompetencyScore = async (userId, targetName, scoreIncrease = 16) => {
  // Find competency by name substring
  const targetComp = await UserCompetency.findOne({
    user: userId,
    name: { $regex: new RegExp(targetName, 'i') }
  });

  if (!targetComp) return null;

  const beforeScore = targetComp.currentScore;
  const afterScore = Math.min(100, beforeScore + scoreIncrease);
  const deltaVal = afterScore - beforeScore;

  const { gap, level, priority } = calculateGapAndLevel(afterScore, targetComp.requiredScore);

  targetComp.currentScore = afterScore;
  targetComp.gap = gap;
  targetComp.level = level;
  targetComp.priority = priority;
  targetComp.trend = `+${deltaVal}%`;
  targetComp.trendDirection = 'up';
  targetComp.assessmentsCompleted += 1;
  targetComp.lastAssessed = 'Just now';

  await targetComp.save();

  // Recalculate user's overall competency average
  const allUserComps = await UserCompetency.find({ user: userId });
  const totalScore = allUserComps.reduce((acc, curr) => acc + curr.currentScore, 0);
  const avgCompetency = Math.round(totalScore / allUserComps.length);

  await User.findByIdAndUpdate(userId, {
    'stats.overallCompetency': avgCompetency,
    'stats.competencyDelta': deltaVal > 0 ? `+${deltaVal}% from recent assessment` : 'Calibrated'
  });

  return {
    competencyName: targetComp.name,
    beforeScore,
    afterScore,
    delta: `+${deltaVal}%`,
    status: afterScore >= targetComp.requiredScore
      ? 'Competency threshold achieved!'
      : `Approaching required ${targetComp.requiredScore}% target`
  };
};
