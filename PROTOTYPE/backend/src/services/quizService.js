import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import LearningPath from '../models/LearningPath.js';
import { updateUserCompetencyScore } from './competencyService.js';

export const OFFICIAL_QUIZ_QUESTIONS = [
  {
    id: 1,
    questionNumber: 1,
    question: 'Which sampling technique gives every member of the population an equal and known non-zero probability of selection?',
    options: [
      { id: 'A', text: 'Stratified Sampling with unequal allocation' },
      { id: 'B', text: 'Simple Random Sampling (SRS)' },
      { id: 'C', text: 'Cluster Sampling without second-stage listing' },
      { id: 'D', text: 'Purposive Convenience Sampling' }
    ],
    correctAnswer: 'B',
    explanation: 'In Simple Random Sampling (SRS), each unit in the sampling frame has an exact equal probability (1/N) of being included in the sample.',
    competency: 'Survey Methodology',
    difficulty: 'Easy'
  },
  {
    id: 2,
    questionNumber: 2,
    question: 'In the operational framework of the National Sample Survey (NSS) in India, what does a "First Stage Unit" (FSU) typically represent in rural areas?',
    options: [
      { id: 'A', text: 'A single agricultural household' },
      { id: 'B', text: 'A Census Village (or Panchayat ward if split)' },
      { id: 'C', text: 'A Development Block headquarters' },
      { id: 'D', text: 'An entire District administrative zone' }
    ],
    correctAnswer: 'B',
    explanation: 'In rural rounds of NSS surveys, the 2011 Census village (or an investigator unit/hamlet group) serves as the primary sampling unit or First Stage Unit (FSU).',
    competency: 'Survey Methodology',
    difficulty: 'Medium'
  },
  {
    id: 3,
    questionNumber: 3,
    question: 'Which Python Pandas method is standard for imputing missing statistical values in a numeric column with its arithmetic mean?',
    options: [
      { id: 'A', text: 'df["income"].replace_null(method="mean")' },
      { id: 'B', text: 'df["income"].fillna(df["income"].mean(), inplace=True)' },
      { id: 'C', text: 'df["income"].drop_na(value="average")' },
      { id: 'D', text: 'pandas.impute_mean(df, "income")' }
    ],
    correctAnswer: 'B',
    explanation: '`.fillna()` with the computed `.mean()` of the series is the canonical vectorized pandas operation for mean imputation.',
    competency: 'Python for Data Analysis',
    difficulty: 'Medium'
  },
  {
    id: 4,
    questionNumber: 4,
    question: 'What is the characteristic property of the Laspeyres Price Index formula commonly used in national index computations?',
    options: [
      { id: 'A', text: 'It uses current-period quantity weights (pt * qt / p0 * qt)' },
      { id: 'B', text: 'It utilizes base-period basket quantities as weights (pt * q0 / p0 * q0)' },
      { id: 'C', text: 'It is the unweighted geometric mean of relative prices' },
      { id: 'D', text: 'It automatically accounts for consumer substitution bias' }
    ],
    correctAnswer: 'B',
    explanation: 'The Laspeyres Price Index holds the base period commodity basket quantities (q0) constant and compares current prices against base prices.',
    competency: 'Data Analysis',
    difficulty: 'Medium'
  },
  {
    id: 5,
    questionNumber: 5,
    question: 'Which diagnostic visual chart is most rigorous for checking whether survey residuals or continuous variables conform to a normal distribution?',
    options: [
      { id: 'A', text: 'Pie chart with percentage wedges' },
      { id: 'B', text: 'Quantile-Quantile (Q-Q) Probability Plot' },
      { id: 'C', text: 'Stacked 3D Bar Chart' },
      { id: 'D', text: 'Radar Spider Diagram' }
    ],
    correctAnswer: 'B',
    explanation: 'A Quantile-Quantile (Q-Q) plot graphs sample quantiles against theoretical normal distribution quantiles; points lying along a straight 45-degree diagonal indicate normality.',
    competency: 'Data Visualization',
    difficulty: 'Medium'
  },
  {
    id: 6,
    questionNumber: 6,
    question: 'In stratified sampling, when sample size is allocated across strata proportionally to the product of stratum size (Nh) and stratum standard deviation (Sh), what is this optimal design called?',
    options: [
      { id: 'A', text: 'Bowley Proportional Allocation' },
      { id: 'B', text: 'Neyman Optimum Allocation' },
      { id: 'C', text: 'Systematic Random Interval Allocation' },
      { id: 'D', text: 'Snowball Cluster Allocation' }
    ],
    correctAnswer: 'B',
    explanation: 'Neyman allocation minimizes the variance of the estimated population mean for a fixed overall sample size by allocating more samples to larger and more variable strata.',
    competency: 'Survey Methodology',
    difficulty: 'Hard'
  },
  {
    id: 7,
    questionNumber: 7,
    question: 'When analyzing highly skewed income or consumer expenditure distribution datasets with extreme upper outliers, which central metric is most statistically robust?',
    options: [
      { id: 'A', text: 'Arithmetic Mean' },
      { id: 'B', text: 'Median (50th Percentile)' },
      { id: 'C', text: 'Mid-range (Min + Max) / 2' },
      { id: 'D', text: 'Root Mean Square' }
    ],
    correctAnswer: 'B',
    explanation: 'The median has a 50% breakdown point and is invariant to extreme skewness and heavy-tailed outliers, making it the preferred standard in official poverty and expenditure reports.',
    competency: 'Data Interpretation',
    difficulty: 'Easy'
  },
  {
    id: 8,
    questionNumber: 8,
    question: 'In Python, which vectorised Pandas construct efficiently groups survey records by State and computes a weighted average consumption per household?',
    options: [
      { id: 'A', text: 'A Python "for" loop iterating over every single row with df.iterrows()' },
      { id: 'B', text: 'df.groupby("state").apply(lambda g: (g["expenditure"] * g["weight"]).sum() / g["weight"].sum())' },
      { id: 'C', text: 'df.sort_values("state").mean()' },
      { id: 'D', text: 'pandas.calculate_weights_sql(df, "SELECT AVG(expenditure)")' }
    ],
    correctAnswer: 'B',
    explanation: 'Groupby with an applied lambda calculating sum(value * weight) / sum(weight) is the standard vectorized approach for group-level survey weighting in Python.',
    competency: 'Python for Data Analysis',
    difficulty: 'Hard'
  },
  {
    id: 9,
    questionNumber: 9,
    question: 'What exact statistical error is bounded when setting the critical significance level (alpha) of an official hypothesis test to 0.05 (5%)?',
    options: [
      { id: 'A', text: 'Type I error: Rejecting a true null hypothesis' },
      { id: 'B', text: 'Type II error: Failing to reject a false null hypothesis' },
      { id: 'C', text: 'Non-sampling measurement recording error' },
      { id: 'D', text: 'Standard error of the regression estimate' }
    ],
    correctAnswer: 'A',
    explanation: 'Alpha (significance level) represents the maximum permissible probability of committing a Type I error (a false positive finding of statistical significance).',
    competency: 'Statistics',
    difficulty: 'Medium'
  },
  {
    id: 10,
    questionNumber: 10,
    question: 'Under official data visualization best practices for government statistical publications, why are 3D perspective charts explicitly discouraged?',
    options: [
      { id: 'A', text: 'They take slightly longer to print in black and white' },
      { id: 'B', text: 'Perspective angles distort area, height perception, and misrepresent true quantitative magnitudes' },
      { id: 'C', text: 'Python and R cannot output 3D graphics files' },
      { id: 'D', text: 'They require specialized 3D glasses for readers to interpret' }
    ],
    correctAnswer: 'B',
    explanation: 'Perspective tilt causes visual occlusion and distorts angle/area judgment, causing readers to misjudge proportions—violating core statistical integrity standards.',
    competency: 'Data Visualization',
    difficulty: 'Easy'
  }
];

export const DEFAULT_QUIZZES = [
  {
    code: 'quiz-201',
    title: 'Statistical Analysis & Python Methods Checkpoint',
    competency: 'Data Analysis & Python',
    questionsCount: 10,
    estimatedMinutes: 15,
    status: 'Available',
    difficulty: 'Intermediate',
    description: 'Comprehensive checkpoint covering sampling probabilities, Pandas group operations, and hypothesis testing.',
    questions: OFFICIAL_QUIZ_QUESTIONS
  },
  {
    code: 'quiz-202',
    title: 'Survey Sampling & FSU Frame Diagnostic Test',
    competency: 'Survey Methodology',
    questionsCount: 10,
    estimatedMinutes: 15,
    status: 'Available',
    difficulty: 'Advanced',
    description: 'Test your grasp of multi-stage stratified allocation, Neyman variance formulas, and listing protocols.',
    questions: OFFICIAL_QUIZ_QUESTIONS
  },
  {
    code: 'quiz-203',
    title: 'Data Visualization & Indicator Presentation Standards',
    competency: 'Data Visualization',
    questionsCount: 10,
    estimatedMinutes: 15,
    status: 'Available',
    difficulty: 'Intermediate',
    description: 'Evaluates knowledge of official chart grammar, 3D distortions, Q-Q plots, and geospatial cartograms.',
    questions: OFFICIAL_QUIZ_QUESTIONS
  }
];

export const ensureDefaultQuizzes = async () => {
  for (const q of DEFAULT_QUIZZES) {
    const exists = await Quiz.findOne({ code: q.code });
    if (!exists) {
      await Quiz.create(q);
    }
  }
};

/**
 * Server-Side Quiz Scoring Engine
 * Evaluates candidate responses, updates competency profile, logs attempt.
 */
export const scoreQuizSubmission = async (userId, quizIdentifier, submissionData) => {
  await ensureDefaultQuizzes();

  const quiz = await Quiz.findOne({
    $or: [{ code: quizIdentifier }, { _id: quizIdentifier }]
  });

  if (!quiz) {
    throw new Error(`Quiz ${quizIdentifier} not found`);
  }

  const userAnswers = submissionData.answers || {};
  let correctCount = 0;

  quiz.questions.forEach((q) => {
    const answeredOpt = userAnswers[q.id] || userAnswers[q.id.toString()];
    if (answeredOpt && answeredOpt.toUpperCase() === q.correctAnswer.toUpperCase()) {
      correctCount++;
    }
  });

  const totalQuestions = quiz.questions.length || 10;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const seconds = submissionData.timeSpentSeconds || 320;
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  const timeSpentStr = `${mins}m ${remSecs.toString().padStart(2, '0')}s`;

  // Dynamically calculate competency score gain based on test performance
  const targetCompName = quiz.competency.includes('Python') || quiz.competency.includes('Data Analysis')
    ? 'Data Analysis'
    : quiz.competency;

  const scoreIncrease = Math.max(4, Math.round((scorePercentage / 100) * 20));

  const competencyDelta = await updateUserCompetencyScore(userId, targetCompName, scoreIncrease) || {
    competencyName: targetCompName,
    beforeScore: 0,
    afterScore: scoreIncrease,
    delta: `+${scoreIncrease}%`,
    status: 'Baseline calibrated'
  };

  const aiAnalysis = scorePercentage >= 70
    ? `Your performance demonstrates solid competency in ${targetCompName} with a score of ${scorePercentage}%. Continue along your personalized curriculum to reach cadre benchmark proficiency.`
    : `Your diagnostic score of ${scorePercentage}% in ${targetCompName} highlights fundamental areas to reinforce. Recommended course modules have been calibrated to accelerate your progress.`;

  const nextRecommendation = {
    courseId: 'course-101',
    title: 'Python for Statistical Computing & Survey Analysis',
    reason: `Addresses the concepts evaluated in this diagnostic to strengthen your ${targetCompName} foundational scores.`,
    route: '/courses/course-101'
  };

  // Record attempt in database
  const attempt = await QuizAttempt.create({
    user: userId,
    quiz: quiz._id,
    quizCode: quiz.code,
    quizTitle: quiz.title,
    answers: userAnswers,
    score: correctCount,
    totalQuestions,
    scorePercentage,
    correctCount,
    incorrectCount,
    timeSpentSeconds: seconds,
    timeSpent: timeSpentStr,
    competencyDelta,
    aiAnalysis,
    nextRecommendation
  });

  // Dynamically update User stats telemetry
  const user = await User.findById(userId);
  const allAttempts = await QuizAttempt.find({ user: userId });
  const avgAssessmentScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((sum, a) => sum + (a.scorePercentage || 0), 0) / allAttempts.length)
    : scorePercentage;

  const hoursLogged = Math.max(0.2, Number((seconds / 3600).toFixed(1)));

  await User.findByIdAndUpdate(userId, {
    'stats.assessmentScore': avgAssessmentScore,
    'stats.scoreDelta': `Latest score: ${scorePercentage}%`,
    'stats.learningStreak': Math.max(1, (user?.stats?.learningStreak || 0) + 1),
    $inc: { 'stats.learningHoursTotal': hoursLogged }
  });

  // Synchronize LearningPath step if this assessment fulfills a step
  const userPath = await LearningPath.findOne({ user: userId });
  if (userPath) {
    let pathUpdated = false;
    userPath.steps.forEach((step) => {
      if (step.courseCode === quiz.code || (step.isAssessment && quiz.code === 'quiz-201')) {
        if (scorePercentage >= 50) {
          step.status = 'Completed';
          step.score = `${scorePercentage}%`;
          step.completedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          pathUpdated = true;
        }
      }
    });

    if (pathUpdated) {
      const completedSteps = userPath.steps.filter((s) => s.status === 'Completed').length;
      const inProg = userPath.steps.find((s) => s.status === 'In Progress');
      const inProgVal = inProg ? (inProg.progress || 0) / 100 : 0;
      userPath.overallProgress = Math.round(((completedSteps + inProgVal) / userPath.steps.length) * 100);
      await userPath.save();
    }
  }

  return {
    id: attempt._id,
    quizId: quiz.code,
    quizTitle: quiz.title,
    completedDate: 'Just now',
    timeSpent: timeSpentStr,
    totalQuestions,
    score: correctCount,
    scorePercentage,
    correctCount,
    incorrectCount,
    competencyDelta,
    aiAnalysis,
    nextRecommendation
  };
};
