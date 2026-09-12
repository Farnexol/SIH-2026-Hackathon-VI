// Mock data for StatIQ - Capacity Building Platform for India's Official Statistical System
// Modeled around the Official Statistical System Framework (OSSF) and iGOT Karmayogi

export const mockUser = {
  id: 'usr-9082',
  name: 'Rahul Sharma',
  email: 'demo@statiq.ai',
  role: 'Learner',
  isProfileCompleted: true,
  designation: 'Statistical Officer (Grade II)',
  department: 'Data Analysis Division',
  organization: 'National Statistical Office (NSO), MoSPI',
  employeeId: 'SO-2024-8841',
  joiningDate: '15 March 2021',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  competencyFramework: 'Official Statistical System Framework (OSSF-2026)',
  learningGoals: 'Master Python for Statistical Computing & Advanced Survey Data Visualization',
  stats: {
    overallCompetency: 68,
    competencyDelta: '+8% this month',
    learningProgress: 72,
    completedCourses: 12,
    totalCourses: 17,
    assessmentScore: 84,
    scoreDelta: '+6% improvement',
    learningStreak: 7,
    learningHoursTotal: 64.5,
  },
  preferences: {
    learningDifficulty: 'Intermediate',
    preferredContentType: 'Interactive Modules & Case Studies',
    language: 'English (with Hindi terminology glossaries)',
    emailNotifications: true,
    weeklyDigest: true,
  }
};

export const mockCompetencies = [
  {
    id: 'comp-1',
    name: 'Statistics',
    category: 'Core Statistical Foundations',
    currentScore: 84,
    requiredScore: 75,
    gap: 0,
    level: 'Strong',
    trend: '+4%',
    trendDirection: 'up',
    description: 'Probability theory, hypothesis testing, distributions, variance estimation, and inference.',
    assessmentsCompleted: 6,
    recommendedAction: 'Maintain mastery through advanced peer reviews',
    lastAssessed: '3 days ago'
  },
  {
    id: 'comp-2',
    name: 'Data Analysis',
    category: 'Statistical Processing',
    currentScore: 62,
    requiredScore: 75,
    gap: 13,
    level: 'Moderate',
    trend: '+6%',
    trendDirection: 'up',
    description: 'Exploratory data analysis, correlation, regression models, multivariate methods, and weighting.',
    assessmentsCompleted: 4,
    recommendedAction: 'Complete Applied Regression on Survey Datasets',
    lastAssessed: 'Yesterday'
  },
  {
    id: 'comp-3',
    name: 'Python for Data Analysis',
    category: 'Statistical Computing',
    currentScore: 38,
    requiredScore: 80,
    gap: 42,
    level: 'Needs Improvement',
    priority: 'High',
    trend: '-2%',
    trendDirection: 'down',
    description: 'Python scripting, Pandas for tabulations, NumPy vector calculations, micro-data cleaning.',
    assessmentsCompleted: 3,
    recommendedAction: 'Start Recommended Path: NumPy & Pandas for Official Statistics',
    lastAssessed: '5 days ago'
  },
  {
    id: 'comp-4',
    name: 'Data Visualization',
    category: 'Dissemination & Reporting',
    currentScore: 48,
    requiredScore: 75,
    gap: 27,
    level: 'Needs Improvement',
    priority: 'Medium',
    trend: '+1%',
    trendDirection: 'up',
    description: 'Effective chart grammar, MoSPI indicator dashboards, geospatial maps, and publication charts.',
    assessmentsCompleted: 2,
    recommendedAction: 'Enroll in Official Indicators & Chart Standards',
    lastAssessed: '1 week ago'
  },
  {
    id: 'comp-5',
    name: 'Survey Methodology',
    category: 'Field Operations & Design',
    currentScore: 76,
    requiredScore: 70,
    gap: 0,
    level: 'Strong',
    trend: '+3%',
    trendDirection: 'up',
    description: 'Multi-stage stratified sampling, FSU selection, frame validation, and non-sampling error control.',
    assessmentsCompleted: 7,
    recommendedAction: 'Eligible for Mentor Certification in NSS Designs',
    lastAssessed: '2 weeks ago'
  },
  {
    id: 'comp-6',
    name: 'Statistical Computing',
    category: 'Statistical Computing',
    currentScore: 55,
    requiredScore: 70,
    gap: 15,
    level: 'Moderate',
    priority: 'Low',
    trend: '+5%',
    trendDirection: 'up',
    description: 'Batch processing, automated tabulation algorithms, data cleaning pipelines, and macro scripts.',
    assessmentsCompleted: 4,
    recommendedAction: 'Practice automated tabulation workflows',
    lastAssessed: '4 days ago'
  },
  {
    id: 'comp-7',
    name: 'Data Interpretation',
    category: 'Core Statistical Foundations',
    currentScore: 81,
    requiredScore: 75,
    gap: 0,
    level: 'Strong',
    trend: '+2%',
    trendDirection: 'up',
    description: 'Official statistical brief drafting, indicator contextualization, metadata adherence, and trend scrutiny.',
    assessmentsCompleted: 5,
    recommendedAction: 'Maintain mastery through National Accounts briefing papers',
    lastAssessed: '1 week ago'
  }
];

export const mockPriorityGaps = [
  {
    id: 'gap-1',
    competencyId: 'comp-3',
    title: 'Python for Data Analysis',
    current: 38,
    required: 80,
    gap: 42,
    priority: 'High',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    buttonText: 'View Learning Path',
    route: '/learning-path',
    context: 'Directly impacts automated tabulation for PLFS and ASI micro-data files.'
  },
  {
    id: 'gap-2',
    competencyId: 'comp-4',
    title: 'Data Visualization',
    current: 48,
    required: 75,
    gap: 27,
    priority: 'Medium',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    buttonText: 'View Recommendations',
    route: '/courses?competency=Data Visualization',
    context: 'Essential for preparing quarterly statistical bulletins and infographics.'
  },
  {
    id: 'gap-3',
    competencyId: 'comp-6',
    title: 'Statistical Computing',
    current: 55,
    required: 70,
    gap: 15,
    priority: 'Low',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    buttonText: 'Improve Skill',
    route: '/courses?competency=Statistical Computing',
    context: 'Enhances execution speed for national index aggregations.'
  }
];

export const mockAIInsight = {
  headline: 'Your biggest current competency gap is Data Visualization & Python for Data Analysis.',
  advisorRationale: 'Based on your role as Statistical Officer (Grade II) in Data Analysis Division, upcoming 2026 survey round requirements demand automated scripting and publication-grade charting.',
  recommendedNextSteps: [
    { step: 1, title: 'Complete Python Fundamentals', status: 'Completed' },
    { step: 2, title: 'Learn Pandas for Statistical Data Processing', status: 'In Progress' },
    { step: 3, title: 'Complete Data Visualization Module', status: 'Not Started' },
    { step: 4, title: 'Take the Adaptive Official Data Assessment', status: 'Upcoming' }
  ],
  actionButtonText: 'Start Recommended Path',
  actionRoute: '/learning-path'
};

export const mockLearningPath = {
  competencyTarget: 'Python for Data Analysis',
  requiredLevel: '80% Required Proficiency',
  currentLevel: '38% Current Proficiency',
  targetRole: 'Statistical Officer - Automated Micro-Data Specialist',
  overallProgress: 35,
  steps: [
    {
      id: 1,
      title: 'Python Fundamentals for Statistical Officers',
      duration: '2h 15m',
      status: 'Completed',
      score: '92%',
      completedDate: 'Feb 28, 2026',
      description: 'Syntax, data types, lists, dictionaries, functions, and file I/O for text and CSV survey formats.',
      modulesCount: 4,
      isAssessment: false
    },
    {
      id: 2,
      title: 'NumPy & Pandas for Statistical Data Processing',
      duration: '3h 45m',
      status: 'In Progress',
      progress: 45,
      description: 'Multi-dimensional arrays, Series, DataFrames, group-by aggregations, survey weight operations.',
      modulesCount: 5,
      isAssessment: false
    },
    {
      id: 3,
      title: 'Data Cleaning & Validation for Official Surveys',
      duration: '2h 50m',
      status: 'Not Started',
      description: 'Handling missing values, outlier detection in NSS micro-data, imputation methodologies, schema verification.',
      modulesCount: 4,
      isAssessment: false
    },
    {
      id: 4,
      title: 'Statistical Data Analysis & Hypothesis Testing with SciPy',
      duration: '3h 10m',
      status: 'Not Started',
      description: 'T-tests, Chi-square independence tests, ANOVA, and linear regression models on official datasets.',
      modulesCount: 5,
      isAssessment: false
    },
    {
      id: 5,
      title: 'Data Visualization for Statistical Bulletins (Seaborn & Plotly)',
      duration: '2h 30m',
      status: 'Not Started',
      description: 'Distribution charts, time-series trends, MoSPI style guides, interactive dashboard exports.',
      modulesCount: 4,
      isAssessment: false
    },
    {
      id: 6,
      title: 'Comprehensive Python Statistical Competency Assessment',
      duration: '45 mins',
      status: 'Locked',
      description: 'Adaptive assessment validating practical coding and conceptual statistical calculation capabilities.',
      modulesCount: 1,
      isAssessment: true
    }
  ]
};

export const mockCourses = [
  {
    id: 'course-101',
    title: 'Python for Statistical Data Analysis',
    description: 'Master practical Python programming with Pandas and NumPy specifically customized for analyzing large official survey micro-datasets.',
    competencies: ['Python', 'Data Analysis', 'Pandas'],
    difficulty: 'Intermediate',
    duration: '3h 20m',
    progress: 45,
    enrolled: true,
    rating: 4.8,
    reviewsCount: 312,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-204',
    category: 'Statistical Computing',
    recommended: true,
    recommendationReason: 'Recommended because your Python competency is currently 38%, while your role requires 80%.',
    instructor: 'Prof. S. R. Rao, Senior Consultant, Indian Statistical Institute (ISI)',
    learningObjectives: [
      'Load, inspect, and summarize raw survey micro-data files',
      'Apply survey weights to compute correct population aggregates',
      'Handle missing values and apply standard MoSPI imputation techniques',
      'Generate automated cross-tabulations and frequency tables'
    ],
    modules: [
      { id: 1, title: 'Module 1: Python Fundamentals & Data Structures', duration: '40m', completed: true },
      { id: 2, title: 'Module 2: NumPy Arrays & Matrix Calculations', duration: '50m', completed: true },
      { id: 3, title: 'Module 3: Pandas DataFrames for Survey Microdata', duration: '55m', completed: false, inProgress: true },
      { id: 4, title: 'Module 4: Data Cleaning, Reshaping & Merging Files', duration: '35m', completed: false },
      { id: 5, title: 'Module 5: Statistical Tabulation & Exporting Results', duration: '20m', completed: false }
    ]
  },
  {
    id: 'course-102',
    title: 'Data Visualization & Dashboarding for Official Statistics',
    description: 'Learn principled graphic design for official indicators, CPI trends, and spatial survey maps using modern visualization libraries.',
    competencies: ['Data Visualization', 'Reporting', 'Python'],
    difficulty: 'Intermediate',
    duration: '4h 10m',
    progress: 0,
    enrolled: false,
    rating: 4.7,
    reviewsCount: 204,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-312',
    category: 'Dissemination',
    recommended: true,
    recommendationReason: 'Addresses your 27% competency gap in statistical chart design and indicator presentation.',
    instructor: 'Dr. Meenakshi Sundaram, NSO Data Dissemination Wing',
    learningObjectives: [
      'Design publication-grade charts adhering to national publication standards',
      'Construct time-series indices without visual distortion',
      'Map state-level socio-economic indicators using GeoPandas',
      'Build interactive HTML dashboard summaries for executive briefings'
    ],
    modules: [
      { id: 1, title: 'Module 1: Principles of Data Visualization for Statistics', duration: '45m', completed: false },
      { id: 2, title: 'Module 2: Matplotlib & Seaborn Customizations', duration: '60m', completed: false },
      { id: 3, title: 'Module 3: Visualizing Index Numbers & Time Series', duration: '55m', completed: false },
      { id: 4, title: 'Module 4: Geospatial Thematic Mapping of Survey Data', duration: '50m', completed: false },
      { id: 5, title: 'Module 5: Interactive Visualizations with Plotly', duration: '40m', completed: false }
    ]
  },
  {
    id: 'course-103',
    title: 'Statistical Computing & Automated Tabulation Workflows',
    description: 'Accelerate the production of standard national tables using automated batch processing scripts and reproducible data pipelines.',
    competencies: ['Statistical Computing', 'Data Analysis'],
    difficulty: 'Beginner to Intermediate',
    duration: '2h 45m',
    progress: 20,
    enrolled: true,
    rating: 4.6,
    reviewsCount: 178,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-189',
    category: 'Statistical Computing',
    recommended: true,
    recommendationReason: 'Closes your 15% gap in batch data computation and micro-data aggregation.',
    instructor: 'Anand Kulkarni, Director, Computer Centre, MoSPI',
    learningObjectives: [
      'Automate monthly indicator computation pipelines',
      'Perform high-speed batch aggregation across millions of records',
      'Implement data validation checks before publication'
    ],
    modules: [
      { id: 1, title: 'Module 1: Introduction to Batch Computing in Statistics', duration: '30m', completed: true },
      { id: 2, title: 'Module 2: Writing Scalable Aggregation Routines', duration: '45m', completed: false },
      { id: 3, title: 'Module 3: Error Logging & Automated Audit Trails', duration: '45m', completed: false },
      { id: 4, title: 'Module 4: Output Generation in Excel and CSV Formats', duration: '45m', completed: false }
    ]
  },
  {
    id: 'course-104',
    title: 'Survey Sampling Techniques & Error Estimation in NSS',
    description: 'In-depth review of stratified multi-stage design, first-stage units (FSUs), second-stage stratification, and variance estimation.',
    competencies: ['Survey Methodology', 'Statistics'],
    difficulty: 'Advanced',
    duration: '5h 00m',
    progress: 85,
    enrolled: true,
    rating: 4.9,
    reviewsCount: 420,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-401',
    category: 'Field Operations & Design',
    recommended: false,
    recommendationReason: 'Advanced enrichment course aligned with your strong survey methodology competency (76%).',
    instructor: 'Dr. K. N. Vyas, Former Member, National Statistical Commission',
    learningObjectives: [
      'Master Neyman and proportional sample allocation formulas',
      'Compute design effects (Deff) and coefficients of variation (CV)',
      'Account for non-response and post-stratification adjustments'
    ],
    modules: [
      { id: 1, title: 'Module 1: NSS Sampling Design Overview', duration: '60m', completed: true },
      { id: 2, title: 'Module 2: Selection of FSUs and Household Stratification', duration: '70m', completed: true },
      { id: 3, title: 'Module 3: Multiplier Generation & Weight Derivation', duration: '80m', completed: true },
      { id: 4, title: 'Module 4: Sub-sample Variance & Standard Error Calculation', duration: '90m', completed: false }
    ]
  },
  {
    id: 'course-105',
    title: 'National Accounts Statistics: Concepts & Compilation',
    description: 'System of National Accounts (SNA 2008), Gross Domestic Product (GDP), Gross Value Added (GVA), and sector-wise compilation.',
    competencies: ['Statistics', 'Data Interpretation'],
    difficulty: 'Advanced',
    duration: '6h 30m',
    progress: 100,
    enrolled: true,
    rating: 4.9,
    reviewsCount: 512,
    source: 'National Accounts Division (NAD)',
    igotCourseId: 'IGOT-STAT-455',
    category: 'Core Statistical Foundations',
    recommended: false,
    recommendationReason: 'Completed core foundation course reinforcing data interpretation competency (81%).',
    instructor: 'Additional Director General, NAD, MoSPI',
    learningObjectives: [
      'Understand production, income, and expenditure approaches to GDP',
      'Compile supply-use tables and input-output coefficients',
      'Evaluate deflators and constant price adjustments'
    ],
    modules: [
      { id: 1, title: 'Module 1: Overview of SNA 2008 & Indian Framework', duration: '75m', completed: true },
      { id: 2, title: 'Module 2: Agriculture & Industrial GVA Estimation', duration: '90m', completed: true },
      { id: 3, title: 'Module 3: Financial Intermediation & Services Sector', duration: '85m', completed: true },
      { id: 4, title: 'Module 4: Deflators, Base Years & Revisions', duration: '70m', completed: true },
      { id: 5, title: 'Module 5: Practical National Accounts Exercises', duration: '70m', completed: true }
    ]
  },
  {
    id: 'course-106',
    title: 'Consumer Price Index (CPI) Compilation & Price Statistics',
    description: 'Technical methodology for item basket selection, base year revision, Laspeyres vs. geometric mean indices, and rent imputation.',
    competencies: ['Statistics', 'Data Analysis'],
    difficulty: 'Intermediate',
    duration: '3h 50m',
    progress: 60,
    enrolled: true,
    rating: 4.7,
    reviewsCount: 195,
    source: 'Price Statistics Division',
    igotCourseId: 'IGOT-STAT-220',
    category: 'Statistical Processing',
    recommended: false,
    recommendationReason: 'Enhances index number calculation methods for regular official bulletin releases.',
    instructor: 'Joint Director, Price Statistics Division',
    learningObjectives: [
      'Compute elementary price aggregates using Jevons and Dutot indices',
      'Compile state and all-India sub-group indices',
      'Handle seasonal items and missing price observations'
    ],
    modules: [
      { id: 1, title: 'Module 1: CPI Basket & Weighting Diagrams', duration: '50m', completed: true },
      { id: 2, title: 'Module 2: Price Collection & Validation at Field Level', duration: '55m', completed: true },
      { id: 3, title: 'Module 3: Index Calculation Formulas & Imputations', duration: '65m', completed: false },
      { id: 4, title: 'Module 4: Quality Adjustment and Base Revision Protocols', duration: '60m', completed: false }
    ]
  }
];

export const mockMaterials = [
  {
    id: 'mat-1',
    name: 'National Sample Survey (NSS) 78th Round Instruction Manual.pdf',
    type: 'PDF',
    size: '4.2 MB',
    pages: 148,
    uploadDate: '2 days ago',
    status: 'Analyzed',
    detectedCompetency: 'Survey Methodology & Sampling',
    generatedQuestionsCount: 25,
    summary: 'Comprehensive manual detailing sampling design, Schedule 0.0 listing protocols, household selection criteria, and multiplier calculation methods for socio-economic survey rounds.',
    keyTopics: ['First Stage Units', 'Neyman Allocation', 'Multiplier Derivation', 'Non-Sampling Errors']
  },
  {
    id: 'mat-2',
    name: 'Consumer Price Index (CPI) Technical Compilation Note.docx',
    type: 'DOCX',
    size: '1.8 MB',
    pages: 42,
    uploadDate: '5 days ago',
    status: 'Analyzed',
    detectedCompetency: 'Statistical Computing & Price Indices',
    generatedQuestionsCount: 15,
    summary: 'Technical guidance on elementary aggregate calculation, geometric mean versus Laspeyres weighting, rural-urban aggregation, and base year chaining techniques.',
    keyTopics: ['Laspeyres Formula', 'Elementary Aggregates', 'Quality Changes', 'Imputation Protocols']
  },
  {
    id: 'mat-3',
    name: 'Periodic Labour Force Survey (PLFS) Sampling Design.pdf',
    type: 'PDF',
    size: '3.5 MB',
    pages: 94,
    uploadDate: '1 week ago',
    status: 'Analyzed',
    detectedCompetency: 'Data Analysis & Survey Methodology',
    generatedQuestionsCount: 20,
    summary: 'Operational design for rotational panel sampling in urban areas and annual visits in rural sectors for continuous employment-unemployment indicator monitoring.',
    keyTopics: ['Rotational Panel Sampling', 'Current Weekly Status', 'Principal Activity', 'Panel Attrition']
  }
];

export const mockQuizQuestions = [
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

export const mockQuizResultData = {
  quizId: 'quiz-201',
  quizTitle: 'Statistical Analysis & Python Methods Checkpoint',
  completedDate: 'Just now',
  timeSpent: '7m 32s',
  totalQuestions: 10,
  score: 8,
  scorePercentage: 80,
  correctCount: 8,
  incorrectCount: 2,
  competencyDelta: {
    competencyName: 'Data Analysis',
    beforeScore: 52,
    afterScore: 68,
    delta: '+16%',
    status: 'Progressing toward required 75%'
  },
  aiAnalysis: 'Your performance indicates strong improvement in survey data analysis fundamentals and weighted aggregation. However, visualization design standards and advanced Python optimization remain priority areas for focused capacity building.',
  nextRecommendation: {
    courseId: 'course-102',
    title: 'Data Visualization & Dashboarding for Official Statistics',
    reason: 'Completes the feedback loop by targeting your 27% visualization gap identified during the assessment.',
    route: '/courses/course-102'
  }
};

export const mockAnalytics = {
  competencyGrowth: [
    { month: 'Oct 2025', Statistics: 72, DataAnalysis: 48, Python: 22, DataViz: 38, SurveyMethod: 70 },
    { month: 'Nov 2025', Statistics: 75, DataAnalysis: 50, Python: 25, DataViz: 40, SurveyMethod: 72 },
    { month: 'Dec 2025', Statistics: 78, DataAnalysis: 54, Python: 30, DataViz: 42, SurveyMethod: 74 },
    { month: 'Jan 2026', Statistics: 80, DataAnalysis: 56, Python: 34, DataViz: 45, SurveyMethod: 75 },
    { month: 'Feb 2026', Statistics: 82, DataAnalysis: 60, Python: 36, DataViz: 46, SurveyMethod: 75 },
    { month: 'Mar 2026', Statistics: 84, DataAnalysis: 68, Python: 38, DataViz: 48, SurveyMethod: 76 }
  ],
  weeklyLearningHours: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 4.1 },
    { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 3.5 }
  ],
  assessmentHistory: [
    { id: 1, title: 'Foundations of Statistical Inference', date: 'Jan 12', score: 72, competency: 'Statistics' },
    { id: 2, title: 'Survey Sampling & Multipliers Quiz', date: 'Jan 28', score: 78, competency: 'Survey Methodology' },
    { id: 3, title: 'Python Syntax & Lists Diagnostics', date: 'Feb 10', score: 65, competency: 'Python' },
    { id: 4, title: 'Pandas Aggregations Practice Test', date: 'Feb 24', score: 70, competency: 'Python' },
    { id: 5, title: 'Data Cleaning & Outlier Detection Test', date: 'Mar 02', score: 82, competency: 'Data Analysis' },
    { id: 6, title: 'Official Indicators Comprehensive Assessment', date: 'Today', score: 80, competency: 'Data Analysis' }
  ],
  radarData: [
    { subject: 'Statistics', current: 84, required: 75, fullMark: 100 },
    { subject: 'Data Analysis', current: 68, required: 75, fullMark: 100 },
    { subject: 'Python', current: 38, required: 80, fullMark: 100 },
    { subject: 'Data Viz', current: 48, required: 75, fullMark: 100 },
    { subject: 'Survey Design', current: 76, required: 70, fullMark: 100 },
    { subject: 'Stat Computing', current: 55, required: 70, fullMark: 100 },
    { subject: 'Interpretation', current: 81, required: 75, fullMark: 100 }
  ],
  strengths: [
    { name: 'Statistics', score: 84, badge: 'Strong' },
    { name: 'Data Interpretation', score: 81, badge: 'Strong' },
    { name: 'Survey Methodology', score: 76, badge: 'Strong' }
  ],
  areasToImprove: [
    { name: 'Python for Data Analysis', current: 38, required: 80, gap: 42, priority: 'High' },
    { name: 'Data Visualization', current: 48, required: 75, gap: 27, priority: 'Medium' },
    { name: 'Statistical Computing', current: 55, required: 70, gap: 15, priority: 'Low' }
  ]
};

export const mockAiAdvisorResponses = {
  'what should i learn next?': `**Recommended Next Step:**
Based on your current competency profile, your most urgent priority is **Module 3 (Pandas for Survey Microdata)** in *Python for Statistical Data Analysis*.

**Why?**
Your Python competency is currently at **38%** while your Statistical Officer role requires **80%**. Completing this module will boost your practical ability to compute survey weights and run automated aggregations.`,

  'why is python my highest priority?': `**Priority Rationale:**
1. **Competency Gap:** You have a **42% gap** (Current: 38% vs. Required: 80%), which is the largest single deficiency in your profile.
2. **Operational Demand:** The Data Analysis Division is currently transitioning legacy batch routines to Python pipelines for PLFS and Consumer Expenditure surveys.
3. **Prerequisite Skill:** High proficiency in Python is required before you can master Data Visualization and Statistical Computing modules.`,

  'explain my competency gaps.': `**Summary of Competency Gaps:**
1. **Python for Data Analysis:** Gap of **42%** (Current: 38% | Required: 80%) — *High Priority*
2. **Data Visualization:** Gap of **27%** (Current: 48% | Required: 75%) — *Medium Priority*
3. **Statistical Computing:** Gap of **15%** (Current: 55% | Required: 70%) — *Low Priority*

*Note: Your Statistics (84%), Survey Methodology (76%), and Data Interpretation (81%) competencies are already well above the required threshold.*`,

  'generate a learning plan.': `**Personalized 4-Week Study Plan:**
- **Week 1:** Complete Pandas DataFrames & Survey Weight aggregations (estimated 3 hours).
- **Week 2:** Complete Data Cleaning & Missing Value imputation on NSS datasets (estimated 2.5 hours).
- **Week 3:** Enroll in *Data Visualization for Official Statistics* and complete Modules 1 & 2 (estimated 3 hours).
- **Week 4:** Take the 20-question AI Adaptive Assessment to certify your updated competency score.`,

  'recommend resources for data visualization.': `**Recommended Resources for Data Visualization:**
1. **iGOT Course:** *Data Visualization & Dashboarding for Official Statistics* (4h 10m, includes Matplotlib & GeoPandas)
2. **Manual:** MoSPI Publication Guidelines for Charts, Indicators, and Geospatial Maps (2025 Edition)
3. **Practice Module:** Building interactive indicator dashboards with Python Plotly.`,

  default: `I am your **StatIQ AI Learning Advisor**, specialized in competency building for India's Official Statistical System.

Based on your profile as a **Statistical Officer (Grade II)**, I analyze your assessment outcomes and iGOT Karmayogi course completions to recommend targeted training. 

You can ask me about:
- What you should learn next
- Why Python is your highest priority
- Explaining your competency gaps
- Generating a customized 4-week study schedule`
};
