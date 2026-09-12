export const SEED_COURSES = [
  {
    code: 'course-101',
    title: 'Python for Statistical Data Analysis',
    description: 'Master practical Python programming with Pandas and NumPy specifically customized for analyzing large official survey micro-datasets.',
    competencies: ['Python', 'Data Analysis', 'Pandas'],
    difficulty: 'Intermediate',
    duration: '3h 20m',
    rating: 4.8,
    reviewsCount: 312,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-204',
    category: 'Statistical Computing',
    instructor: 'Prof. S. R. Rao, Senior Consultant, Indian Statistical Institute (ISI)',
    learningObjectives: [
      'Load, inspect, and summarize raw survey micro-data files',
      'Apply survey weights to compute correct population aggregates',
      'Handle missing values and apply standard MoSPI imputation techniques',
      'Generate automated cross-tabulations and frequency tables'
    ],
    modules: [
      { id: 1, title: 'Module 1: Python Fundamentals & Data Structures', duration: '40m' },
      { id: 2, title: 'Module 2: NumPy Arrays & Matrix Calculations', duration: '50m' },
      { id: 3, title: 'Module 3: Pandas DataFrames for Survey Microdata', duration: '55m' },
      { id: 4, title: 'Module 4: Data Cleaning, Reshaping & Merging Files', duration: '35m' },
      { id: 5, title: 'Module 5: Statistical Tabulation & Exporting Results', duration: '20m' }
    ]
  },
  {
    code: 'course-102',
    title: 'Data Visualization & Dashboarding for Official Statistics',
    description: 'Learn principled graphic design for official indicators, CPI trends, and spatial survey maps using modern visualization libraries.',
    competencies: ['Data Visualization', 'Reporting', 'Python'],
    difficulty: 'Intermediate',
    duration: '4h 10m',
    rating: 4.7,
    reviewsCount: 204,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-312',
    category: 'Dissemination',
    instructor: 'Dr. Meenakshi Sundaram, NSO Data Dissemination Wing',
    learningObjectives: [
      'Design publication-grade charts adhering to national publication standards',
      'Construct time-series indices without visual distortion',
      'Map state-level socio-economic indicators using GeoPandas',
      'Build interactive HTML dashboard summaries for executive briefings'
    ],
    modules: [
      { id: 1, title: 'Module 1: Principles of Data Visualization for Statistics', duration: '45m' },
      { id: 2, title: 'Module 2: Matplotlib & Seaborn Customizations', duration: '60m' },
      { id: 3, title: 'Module 3: Visualizing Index Numbers & Time Series', duration: '55m' },
      { id: 4, title: 'Module 4: Geospatial Thematic Mapping of Survey Data', duration: '50m' },
      { id: 5, title: 'Module 5: Interactive Visualizations with Plotly', duration: '40m' }
    ]
  },
  {
    code: 'course-103',
    title: 'Statistical Computing & Automated Tabulation Workflows',
    description: 'Accelerate the production of standard national tables using automated batch processing scripts and reproducible data pipelines.',
    competencies: ['Statistical Computing', 'Data Analysis'],
    difficulty: 'Beginner to Intermediate',
    duration: '2h 45m',
    rating: 4.6,
    reviewsCount: 178,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-189',
    category: 'Statistical Computing',
    instructor: 'Anand Kulkarni, Director, Computer Centre, MoSPI',
    learningObjectives: [
      'Automate monthly indicator computation pipelines',
      'Perform high-speed batch aggregation across millions of records',
      'Implement data validation checks before publication'
    ],
    modules: [
      { id: 1, title: 'Module 1: Introduction to Batch Computing in Statistics', duration: '30m' },
      { id: 2, title: 'Module 2: Writing Scalable Aggregation Routines', duration: '45m' },
      { id: 3, title: 'Module 3: Error Logging & Automated Audit Trails', duration: '45m' },
      { id: 4, title: 'Module 4: Output Generation in Excel and CSV Formats', duration: '45m' }
    ]
  },
  {
    code: 'course-104',
    title: 'Survey Sampling Techniques & Error Estimation in NSS',
    description: 'In-depth review of stratified multi-stage design, first-stage units (FSUs), second-stage stratification, and variance estimation.',
    competencies: ['Survey Methodology', 'Statistics'],
    difficulty: 'Advanced',
    duration: '5h 00m',
    rating: 4.9,
    reviewsCount: 420,
    source: 'iGOT Karmayogi',
    igotCourseId: 'IGOT-STAT-401',
    category: 'Field Operations & Design',
    instructor: 'Dr. K. N. Vyas, Former Member, National Statistical Commission',
    learningObjectives: [
      'Master Neyman and proportional sample allocation formulas',
      'Compute design effects (Deff) and coefficients of variation (CV)',
      'Account for non-response and post-stratification adjustments'
    ],
    modules: [
      { id: 1, title: 'Module 1: NSS Sampling Design Overview', duration: '60m' },
      { id: 2, title: 'Module 2: Selection of FSUs and Household Stratification', duration: '70m' },
      { id: 3, title: 'Module 3: Multiplier Generation & Weight Derivation', duration: '80m' },
      { id: 4, title: 'Module 4: Sub-sample Variance & Standard Error Calculation', duration: '90m' }
    ]
  },
  {
    code: 'course-105',
    title: 'National Accounts Statistics: Concepts & Compilation',
    description: 'System of National Accounts (SNA 2008), Gross Domestic Product (GDP), Gross Value Added (GVA), and sector-wise compilation.',
    competencies: ['Statistics', 'Data Interpretation'],
    difficulty: 'Advanced',
    duration: '6h 30m',
    rating: 4.9,
    reviewsCount: 512,
    source: 'National Accounts Division (NAD)',
    igotCourseId: 'IGOT-STAT-455',
    category: 'Core Statistical Foundations',
    instructor: 'Additional Director General, NAD, MoSPI',
    learningObjectives: [
      'Understand production, income, and expenditure approaches to GDP',
      'Compile supply-use tables and input-output coefficients',
      'Evaluate deflators and constant price adjustments'
    ],
    modules: [
      { id: 1, title: 'Module 1: Overview of SNA 2008 & Indian Framework', duration: '75m' },
      { id: 2, title: 'Module 2: Agriculture & Industrial GVA Estimation', duration: '90m' },
      { id: 3, title: 'Module 3: Financial Intermediation & Services Sector', duration: '85m' },
      { id: 4, title: 'Module 4: Deflators, Base Years & Revisions', duration: '70m' },
      { id: 5, title: 'Module 5: Practical National Accounts Exercises', duration: '70m' }
    ]
  },
  {
    code: 'course-106',
    title: 'Consumer Price Index (CPI) Compilation & Price Statistics',
    description: 'Technical methodology for item basket selection, base year revision, Laspeyres vs. geometric mean indices, and rent imputation.',
    competencies: ['Statistics', 'Data Analysis'],
    difficulty: 'Intermediate',
    duration: '3h 50m',
    rating: 4.7,
    reviewsCount: 195,
    source: 'Price Statistics Division',
    igotCourseId: 'IGOT-STAT-220',
    category: 'Statistical Processing',
    instructor: 'Joint Director, Price Statistics Division',
    learningObjectives: [
      'Compute elementary price aggregates using Jevons and Dutot indices',
      'Compile state and all-India sub-group indices',
      'Handle seasonal items and missing price observations'
    ],
    modules: [
      { id: 1, title: 'Module 1: CPI Basket & Weighting Diagrams', duration: '50m' },
      { id: 2, title: 'Module 2: Price Collection & Validation at Field Level', duration: '55m' },
      { id: 3, title: 'Module 3: Index Calculation Formulas & Imputations', duration: '65m' },
      { id: 4, title: 'Module 4: Quality Adjustment and Base Revision Protocols', duration: '60m' }
    ]
  }
];
