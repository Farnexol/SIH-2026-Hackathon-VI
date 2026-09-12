import LearningPath from '../models/LearningPath.js';
import UserCompetency from '../models/UserCompetency.js';
import User from '../models/User.js';

export const DEFAULT_LEARNING_PATH_STEPS = [
  {
    id: 1,
    title: 'Python Fundamentals for Statistical Officers',
    duration: '2h 15m',
    status: 'Completed',
    score: '92%',
    completedDate: 'Feb 28, 2026',
    description: 'Syntax, data types, lists, dictionaries, functions, and file I/O for text and CSV survey formats.',
    modulesCount: 4,
    isAssessment: false,
    courseCode: 'course-101'
  },
  {
    id: 2,
    title: 'NumPy & Pandas for Statistical Data Processing',
    duration: '3h 45m',
    status: 'In Progress',
    progress: 45,
    description: 'Multi-dimensional arrays, Series, DataFrames, group-by aggregations, survey weight operations.',
    modulesCount: 5,
    isAssessment: false,
    courseCode: 'course-101'
  },
  {
    id: 3,
    title: 'Data Cleaning & Validation for Official Surveys',
    duration: '2h 50m',
    status: 'Not Started',
    description: 'Handling missing values, outlier detection in NSS micro-data, imputation methodologies, schema verification.',
    modulesCount: 4,
    isAssessment: false,
    courseCode: 'course-103'
  },
  {
    id: 4,
    title: 'Statistical Data Analysis & Hypothesis Testing with SciPy',
    duration: '3h 10m',
    status: 'Not Started',
    description: 'T-tests, Chi-square independence tests, ANOVA, and linear regression models on official datasets.',
    modulesCount: 5,
    isAssessment: false,
    courseCode: 'course-104'
  },
  {
    id: 5,
    title: 'Data Visualization for Statistical Bulletins (Seaborn & Plotly)',
    duration: '2h 30m',
    status: 'Not Started',
    description: 'Distribution charts, time-series trends, MoSPI style guides, interactive dashboard exports.',
    modulesCount: 4,
    isAssessment: false,
    courseCode: 'course-102'
  },
  {
    id: 6,
    title: 'Comprehensive Python Statistical Competency Assessment',
    duration: '45 mins',
    status: 'Locked',
    description: 'Adaptive assessment validating practical coding and conceptual statistical calculation capabilities.',
    modulesCount: 1,
    isAssessment: true,
    courseCode: 'quiz-201'
  }
];

export const createInitialLearningPathSteps = () => [
  {
    id: 1,
    title: 'Python Fundamentals for Statistical Officers',
    duration: '2h 15m',
    status: 'Not Started',
    progress: 0,
    score: null,
    completedDate: null,
    description: 'Syntax, data types, lists, dictionaries, functions, and file I/O for text and CSV survey formats.',
    modulesCount: 4,
    isAssessment: false,
    courseCode: 'course-101'
  },
  {
    id: 2,
    title: 'NumPy & Pandas for Statistical Data Processing',
    duration: '3h 45m',
    status: 'Locked',
    progress: 0,
    score: null,
    completedDate: null,
    description: 'Multi-dimensional arrays, Series, DataFrames, group-by aggregations, survey weight operations.',
    modulesCount: 5,
    isAssessment: false,
    courseCode: 'course-101'
  },
  {
    id: 3,
    title: 'Data Cleaning & Validation for Official Surveys',
    duration: '2h 50m',
    status: 'Locked',
    progress: 0,
    score: null,
    completedDate: null,
    description: 'Handling missing values, outlier detection in NSS micro-data, imputation methodologies, schema verification.',
    modulesCount: 4,
    isAssessment: false,
    courseCode: 'course-103'
  },
  {
    id: 4,
    title: 'Statistical Data Analysis & Hypothesis Testing with SciPy',
    duration: '3h 10m',
    status: 'Locked',
    progress: 0,
    score: null,
    completedDate: null,
    description: 'T-tests, Chi-square independence tests, ANOVA, and linear regression models on official datasets.',
    modulesCount: 5,
    isAssessment: false,
    courseCode: 'course-104'
  },
  {
    id: 5,
    title: 'Data Visualization for Statistical Bulletins (Seaborn & Plotly)',
    duration: '2h 30m',
    status: 'Locked',
    progress: 0,
    score: null,
    completedDate: null,
    description: 'Distribution charts, time-series trends, MoSPI style guides, interactive dashboard exports.',
    modulesCount: 4,
    isAssessment: false,
    courseCode: 'course-102'
  },
  {
    id: 6,
    title: 'Comprehensive Python Statistical Competency Assessment',
    duration: '45 mins',
    status: 'Locked',
    progress: 0,
    score: null,
    completedDate: null,
    description: 'Adaptive assessment validating practical coding and conceptual statistical calculation capabilities.',
    modulesCount: 1,
    isAssessment: true,
    courseCode: 'quiz-201'
  }
];

export const initializeUserLearningPath = async (userId) => {
  const existing = await LearningPath.findOne({ user: userId });
  if (existing) return existing;

  const user = await User.findById(userId);
  const isDemo = user?.email === 'demo@statiq.ai';

  const pythonComp = await UserCompetency.findOne({
    user: userId,
    name: { $regex: /python/i }
  });

  const curLevel = pythonComp ? `${pythonComp.currentScore}% Current Proficiency` : (isDemo ? '38% Current Proficiency' : '0% Current Proficiency');
  const reqLevel = pythonComp ? `${pythonComp.requiredScore}% Required Proficiency` : '80% Required Proficiency';

  const newPath = await LearningPath.create({
    user: userId,
    competencyTarget: 'Python for Data Analysis',
    requiredLevel: reqLevel,
    currentLevel: curLevel,
    targetRole: 'Statistical Officer - Automated Micro-Data Specialist',
    overallProgress: isDemo ? 35 : 0,
    steps: isDemo ? DEFAULT_LEARNING_PATH_STEPS : createInitialLearningPathSteps()
  });

  return newPath;
};

export const getUserLearningPath = async (userId) => {
  let path = await LearningPath.findOne({ user: userId });
  if (!path) {
    path = await initializeUserLearningPath(userId);
  }

  // Synchronize target competency scores dynamically
  const targetComp = await UserCompetency.findOne({
    user: userId,
    name: { $regex: /python/i }
  });

  if (targetComp) {
    path.currentLevel = `${targetComp.currentScore}% Current Proficiency`;
    path.requiredLevel = `${targetComp.requiredScore}% Required Proficiency`;
  }

  // Recalculate progress: count completed steps
  const completedCount = path.steps.filter((s) => s.status === 'Completed').length;
  const inProgressStep = path.steps.find((s) => s.status === 'In Progress');
  const inProgressPortion = inProgressStep ? (inProgressStep.progress || 0) / 100 : 0;
  path.overallProgress = Math.round(((completedCount + inProgressPortion) / path.steps.length) * 100);

  await path.save();
  return path;
};
