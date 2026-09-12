import { useStore } from '../store/useStore';

// Proxy the API methods to Zustand store so existing components don't break

// === Auth & User ===
export const loginUser = async (email, password, role) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return useStore.getState().login(email, password, role);
};

export const getCurrentUser = async () => {
  return { success: true, data: useStore.getState().user };
};

export const getProfile = async () => {
  return { success: true, data: useStore.getState().user };
};

export const updateUserProfile = async (profileData) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  useStore.getState().updateProfile(profileData);
  return { success: true, data: useStore.getState().user };
};

export const getNextId = async () => {
  return 'usr-' + Math.floor(Math.random() * 9000 + 1000);
};

export const registerUser = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const forgotPassword = async ({ email }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const logoutUser = async () => {
  useStore.getState().logout();
  return { success: true };
};

// === Dashboard & Competencies ===
export const getDashboard = async () => {
  return { 
    stats: useStore.getState().user?.stats || {},
    priorityGaps: useStore.getState().priorityGaps || [],
    aiInsight: useStore.getState().aiInsight || {},
    competencies: useStore.getState().competencies || [],
    learningPathSummary: {
      target: useStore.getState().learningPath?.competencyTarget || '',
      progress: useStore.getState().learningPath?.overallProgress || 0,
      nextStep: useStore.getState().learningPath?.steps?.find(s => s.status === 'In Progress')
    }
  };
};

export const getCompetencies = async () => {
  return useStore.getState().competencies;
};

export const getPriorityGaps = async () => {
  return useStore.getState().priorityGaps;
};

// === AI Insights ===
export const getAIInsight = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return useStore.getState().aiInsight;
};

export const askAiAdvisor = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const responses = useStore.getState().aiResponses;
  const lowerQuery = query.toLowerCase();
  
  // Find closest match or default
  const match = Object.keys(responses).find(key => lowerQuery.includes(key));
  const responseText = match ? responses[match] : responses['default'];
  
  return { success: true, data: { text: responseText } };
};

// === Learning Paths & Courses ===
export const getLearningPath = async () => {
  return useStore.getState().learningPath;
};

export const getCourses = async () => {
  return useStore.getState().courses;
};

export const getCourseDetails = async (courseId) => {
  const course = useStore.getState().courses.find(c => c.id === courseId);
  return course;
};

export const getCourseById = async (courseId) => {
  return getCourseDetails(courseId);
};

export const enrollInCourse = async (courseId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  useStore.getState().enrollCourse(courseId);
  return { success: true, message: 'Enrolled successfully' };
};

// === Materials & Assessments ===
export const getLearningMaterials = async () => {
  return useStore.getState().materials;
};

export const getMaterials = async () => {
  return useStore.getState().materials;
};

export const uploadLearningMaterial = async (file, metadata) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Pass metadata to create mock data
  const newMaterial = useStore.getState().uploadMaterial({
    name: file ? file.name : metadata.title || 'Uploaded Document',
    size: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '1.5 MB',
    type: file ? (file.name.endsWith('.pdf') ? 'PDF' : 'DOCX') : 'PDF'
  });
  return { success: true, data: newMaterial };
};

export const getQuizQuestions = async (materialId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return useStore.getState().quizQuestions;
};

export const getQuizzes = async () => {
  // Return mock quizzes for the list view
  const mockQuizList = [
    { id: 'quiz-1', title: 'Survey Design Basics', questionCount: 10, timeLimit: '15m' },
    { id: 'quiz-2', title: 'Statistical Methods', questionCount: 15, timeLimit: '20m' }
  ];
  return mockQuizList;
};

export const getQuizById = async (quizId) => {
  // Just return the questions to represent the quiz
  return { id: quizId, title: 'Mock Quiz', questions: useStore.getState().quizQuestions };
};

export const generateQuizFromMaterial = async (metadata) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { success: true, message: 'Quiz generated' };
};

export const getQuizResult = async (quizId) => {
  return useStore.getState().quizQuestions;
};

export const submitQuiz = async (quizId, answers) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const result = useStore.getState().submitQuiz(quizId, answers);
  return { success: true, data: result };
};

export const submitQuizAnswers = async (quizId, answers) => {
  return submitQuiz(quizId, answers);
};

// === Analytics ===
export const getAnalytics = async () => {
  return useStore.getState().analytics;
};
