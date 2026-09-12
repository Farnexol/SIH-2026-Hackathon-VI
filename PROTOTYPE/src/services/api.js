// StatIQ API Service Layer
// Bridges UI components with Express.js + MongoDB backend.
// Includes transparent offline fallback to guarantee 100% demo resilience during presentations.

import {
  mockUser,
  mockCompetencies,
  mockPriorityGaps,
  mockAIInsight,
  mockLearningPath,
  mockCourses,
  mockMaterials,
  mockQuizQuestions,
  mockQuizResultData,
  mockAnalytics,
  mockAiAdvisorResponses
} from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for authenticated HTTP requests
async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem('statiq_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json();
  if (!response.ok) {
    const errorMsg = Array.isArray(json.errors) && json.errors.length > 0
      ? json.errors.join(', ')
      : (json.message || 'API request failed');
    throw new Error(errorMsg);
  }
  return json.data !== undefined ? json.data : json;
}

// In-memory runtime state for offline demo fallback
let currentUser = { ...mockUser };
let userCompetencies = [...mockCompetencies];
let userMaterials = [...mockMaterials];

// Offline registered users helper
const getOfflineUsers = () => {
  try {
    const saved = localStorage.getItem('statiq_offline_registered_users');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveOfflineUser = (user) => {
  try {
    const users = getOfflineUsers();
    users.push(user);
    localStorage.setItem('statiq_offline_registered_users', JSON.stringify(users));
  } catch {}
};

/**
 * Authentication Services
 */
export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.data?.token) {
        sessionStorage.setItem('statiq_token', data.data.token);
      }
      return {
        success: true,
        token: data.data.token,
        user: data.data.user
      };
    } else {
      return {
        success: false,
        error: data.message || 'Invalid official credentials'
      };
    }
  } catch (err) {
    console.warn('[API] Backend offline login fallback checking local users...');
    const offlineUsers = getOfflineUsers();
    const found = offlineUsers.find(
      (u) => (u.email.toLowerCase() === email.toLowerCase() || u.employeeId === email) && u.password === password
    );
    if (found) {
      const userCopy = { ...found };
      delete userCopy.password;
      currentUser = userCopy;
      return { success: true, user: userCopy };
    }

    if ((email === 'demo@statiq.ai' || email === 'usr-9082') && password === 'demo123') {
      return { success: true, user: { ...mockUser, isProfileCompleted: true } };
    }

    return {
      success: false,
      error: 'Cannot connect to backend server or invalid offline credentials'
    };
  }
}

export async function getNextId() {
  try {
    const res = await request('/auth/next-id');
    return res?.nextId !== undefined ? res.nextId : (getOfflineUsers().length + 1);
  } catch {
    return getOfflineUsers().length + 1;
  }
}

export async function registerUser(formData) {
  try {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  } catch (err) {
    console.warn('[API] Backend offline register fallback:', err.message);
    const offlineUser = {
      id: getOfflineUsers().length + 1,
      employeeId: formData.employeeId || String(getOfflineUsers().length + 1),
      name: formData.name,
      email: formData.email.toLowerCase(),
      department: formData.department || 'Data Analysis Division',
      role: 'Learner',
      isProfileCompleted: false,
      startingDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    saveOfflineUser({ ...offlineUser, password: formData.password });
    return { success: true, user: offlineUser };
  }
}

export async function forgotPassword({ email }) {
  try {
    return await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  } catch (err) {
    console.warn('[API] Forgot password fallback:', err.message);
    return { success: true, message: 'Recovery link dispatched (offline demo mode)' };
  }
}

export async function getCurrentUser() {
  try {
    return await request('/auth/me');
  } catch {
    return null;
  }
}

export async function logoutUser() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {}
  sessionStorage.removeItem('statiq_token');
  return { success: true };
}

/**
 * Dashboard Service
 */
export async function getDashboard() {
  try {
    return await request('/dashboard');
  } catch (err) {
    console.warn('[API] getDashboard fallback:', err.message);
    return {
      user: currentUser,
      stats: currentUser.stats,
      aiInsight: mockAIInsight,
      priorityGaps: mockPriorityGaps,
      competencies: userCompetencies,
      learningPathSummary: {
        target: mockLearningPath.competencyTarget,
        progress: mockLearningPath.overallProgress,
        nextStep: mockLearningPath.steps.find((s) => s.status === 'In Progress')
      }
    };
  }
}

/**
 * Competency Services
 */
export async function getCompetencies() {
  try {
    return await request('/competencies');
  } catch (err) {
    console.warn('[API] getCompetencies fallback:', err.message);
    return userCompetencies;
  }
}

export async function getCompetencyById(id) {
  try {
    return await request(`/competencies/${id}`);
  } catch {
    const found = userCompetencies.find((c) => c.id === id);
    if (!found) throw new Error(`Competency with id ${id} not found`);
    return found;
  }
}

/**
 * Learning Path Service
 */
export async function getLearningPath() {
  try {
    return await request('/learning-path');
  } catch (err) {
    console.warn('[API] getLearningPath fallback:', err.message);
    return mockLearningPath;
  }
}

/**
 * Course Services
 */
export async function getCourses(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.competency && filters.competency !== 'All') params.append('competency', filters.competency);
    if (filters.difficulty && filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
    if (filters.search) params.append('search', filters.search);
    if (filters.recommendedOnly) params.append('recommendedOnly', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    return await request(`/courses${query}`);
  } catch (err) {
    console.warn('[API] getCourses fallback:', err.message);
    let result = [...mockCourses];
    if (filters.competency && filters.competency !== 'All') {
      result = result.filter((c) => c.competencies.includes(filters.competency));
    }
    if (filters.difficulty && filters.difficulty !== 'All') {
      result = result.filter((c) => c.difficulty.toLowerCase().includes(filters.difficulty.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.competencies.some((comp) => comp.toLowerCase().includes(q))
      );
    }
    if (filters.recommendedOnly) {
      result = result.filter((c) => c.recommended);
    }
    return result;
  }
}

export async function getCourseById(id) {
  try {
    return await request(`/courses/${id}`);
  } catch {
    const found = mockCourses.find((c) => c.id === id);
    if (!found) throw new Error(`Course with id ${id} not found`);
    return found;
  }
}

/**
 * AI Recommendations Service
 */
export async function getRecommendations() {
  try {
    const [priorityGaps, recommendedCourses] = await Promise.all([
      request('/competencies/gaps'),
      request('/courses/recommended')
    ]);
    return {
      priorityGaps,
      recommendedCourses,
      aiInsight: mockAIInsight
    };
  } catch {
    return {
      priorityGaps: mockPriorityGaps,
      recommendedCourses: mockCourses.filter((c) => c.recommended),
      aiInsight: mockAIInsight
    };
  }
}

/**
 * Learning Materials & AI MCQ Generation Services
 */
export async function getMaterials() {
  try {
    return await request('/materials');
  } catch (err) {
    console.warn('[API] getMaterials fallback:', err.message);
    return userMaterials;
  }
}

export async function uploadLearningMaterial(file, metadata = {}) {
  try {
    const token = sessionStorage.getItem('statiq_token');
    const formData = new FormData();
    formData.append('file', file);
    if (metadata.competency) formData.append('competency', metadata.competency);
    if (metadata.estimatedPages) formData.append('estimatedPages', metadata.estimatedPages);

    const res = await fetch(`${API_BASE}/materials/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (err) {
    console.warn('[API] uploadLearningMaterial fallback:', err.message);
  }

  const newMaterial = {
    id: `mat-${Date.now()}`,
    name: file.name || 'Official_Statistical_Guideline.pdf',
    type: file.type?.includes('pdf') ? 'PDF' : file.type?.includes('presentation') ? 'PPTX' : 'DOCX',
    size: `${(file.size ? (file.size / (1024 * 1024)).toFixed(1) : 2.4)} MB`,
    pages: metadata.estimatedPages || 36,
    uploadDate: 'Just now',
    status: 'Analyzing',
    detectedCompetency: metadata.competency || 'Data Analysis & Survey Methodology',
    generatedQuestionsCount: 0,
    summary: 'Document uploaded. Extracting structural hierarchies, official definitions, and formula specifications for assessment item generation.',
    keyTopics: ['Survey Frame', 'Validation Rules', 'Aggregation Metrics']
  };

  userMaterials = [newMaterial, ...userMaterials];
  return newMaterial;
}

export async function analyzeMaterial(materialId) {
  try {
    return await request(`/materials/${materialId}/analyze`, { method: 'POST' });
  } catch {
    const mat = userMaterials.find((m) => m.id === materialId);
    if (mat) {
      mat.status = 'Analyzed';
      mat.generatedQuestionsCount = 15;
    }
    return { success: true, material: mat };
  }
}

export async function generateQuizFromMaterial(config) {
  try {
    return await request('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  } catch (err) {
    console.warn('[API] generateQuizFromMaterial fallback:', err.message);
    return {
      quizId: `quiz-${Date.now()}`,
      title: `AI Assessment: ${config.materialName || 'Statistical Methodology'}`,
      questionCount: config.questionCount || 10,
      difficulty: config.difficulty || 'Medium',
      questionType: config.questionType || 'MCQ',
      detectedCompetency: config.competency || 'Survey Methodology',
      questions: mockQuizQuestions.slice(0, config.questionCount || 10)
    };
  }
}

/**
 * Quiz & Assessment Services
 */
export async function getQuizzes() {
  try {
    return await request('/quizzes');
  } catch (err) {
    console.warn('[API] getQuizzes fallback:', err.message);
    return [
      {
        id: 'quiz-201',
        title: 'Statistical Analysis & Python Methods Checkpoint',
        competency: 'Data Analysis & Python',
        questionsCount: 10,
        estimatedMinutes: 15,
        status: 'Available',
        difficulty: 'Intermediate',
        description: 'Comprehensive checkpoint covering sampling probabilities, Pandas group operations, and hypothesis testing.'
      },
      {
        id: 'quiz-202',
        title: 'Survey Sampling & FSU Frame Diagnostic Test',
        competency: 'Survey Methodology',
        questionsCount: 10,
        estimatedMinutes: 15,
        status: 'Available',
        difficulty: 'Advanced',
        description: 'Test your grasp of multi-stage stratified allocation, Neyman variance formulas, and listing protocols.'
      },
      {
        id: 'quiz-203',
        title: 'Data Visualization & Indicator Presentation Standards',
        competency: 'Data Visualization',
        questionsCount: 10,
        estimatedMinutes: 15,
        status: 'Available',
        difficulty: 'Intermediate',
        description: 'Evaluates knowledge of official chart grammar, 3D distortions, Q-Q plots, and geospatial cartograms.'
      }
    ];
  }
}

export async function getQuizById(id) {
  try {
    return await request(`/quizzes/${id}`);
  } catch {
    return {
      id: id || 'quiz-201',
      title: 'Statistical Analysis & Python Methods Checkpoint',
      totalQuestions: mockQuizQuestions.length,
      estimatedMinutes: 15,
      questions: mockQuizQuestions
    };
  }
}

export async function submitQuiz(id, submissionData) {
  try {
    return await request(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });
  } catch (err) {
    console.warn('[API] submitQuiz fallback:', err.message);

    let correctCount = 0;
    mockQuizQuestions.forEach((q) => {
      if (submissionData.answers && submissionData.answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    if (correctCount === 0 && Object.keys(submissionData.answers || {}).length === 0) {
      correctCount = 8;
    }

    const scorePercentage = Math.round((correctCount / mockQuizQuestions.length) * 100);
    const targetComp = userCompetencies.find((c) => c.name === 'Data Analysis');
    const beforeScore = targetComp ? targetComp.currentScore : 52;
    const afterScore = Math.min(beforeScore + 16, 100);

    if (targetComp) {
      targetComp.currentScore = afterScore;
      targetComp.gap = Math.max(0, targetComp.requiredScore - afterScore);
      targetComp.trend = `+${afterScore - beforeScore}%`;
    }

    return {
      ...mockQuizResultData,
      score: correctCount,
      scorePercentage: scorePercentage,
      correctCount: correctCount,
      incorrectCount: mockQuizQuestions.length - correctCount,
      competencyDelta: {
        competencyName: 'Data Analysis',
        beforeScore: beforeScore,
        afterScore: afterScore,
        delta: `+${afterScore - beforeScore}%`,
        status: afterScore >= 75 ? 'Competency threshold achieved!' : 'Approaching required 75% target'
      }
    };
  }
}

/**
 * Analytics Service
 */
export async function getAnalytics() {
  try {
    return await request('/analytics');
  } catch (err) {
    console.warn('[API] getAnalytics fallback:', err.message);
    return mockAnalytics;
  }
}

/**
 * Profile Services
 */
export async function getProfile() {
  try {
    return await request('/profile');
  } catch {
    return currentUser;
  }
}

export async function updateProfile(updatedData) {
  const payload = { ...updatedData, isProfileCompleted: true };
  try {
    const res = await request('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    currentUser = { ...res, isProfileCompleted: true };
    return currentUser;
  } catch {
    currentUser = { ...currentUser, ...payload };
    try {
      const users = getOfflineUsers();
      const idx = users.findIndex((u) => u.email === currentUser.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...currentUser, isProfileCompleted: true };
        localStorage.setItem('statiq_offline_registered_users', JSON.stringify(users));
      }
    } catch {}
    return currentUser;
  }
}

/**
 * AI Learning Advisor Service
 */
export async function askAiAdvisor(promptText) {
  try {
    return await request('/ai/advisor', {
      method: 'POST',
      body: JSON.stringify({ prompt: promptText })
    });
  } catch (err) {
    console.warn('[API] askAiAdvisor fallback:', err.message);
    const clean = promptText.trim().toLowerCase();
    let matchedKey = 'default';
    for (const key of Object.keys(mockAiAdvisorResponses)) {
      if (clean.includes(key.replace(/[.?]/g, '')) || key.includes(clean)) {
        matchedKey = key;
        break;
      }
    }
    return {
      prompt: promptText,
      response: mockAiAdvisorResponses[matchedKey] || mockAiAdvisorResponses.default,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}
