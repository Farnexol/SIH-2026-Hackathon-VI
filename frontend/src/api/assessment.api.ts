import { apiClient } from './client';

export const assessmentApi = {
  getAssessments: async (params?: { type?: string; status?: string }): Promise<any[]> => {
    const response = await apiClient.get('/assessments', { params });
    return response.data;
  },

  getAssessmentById: async (assessmentId: string): Promise<any> => {
    const response = await apiClient.get(`/assessments/${assessmentId}`);
    return response.data;
  },

  generateAssessment: async (payload: {
    title: string;
    question_count?: number;
    difficulty?: string;
    material_id?: string;
    competency_id?: string;
  }): Promise<any> => {
    const response = await apiClient.post('/assessments/generate', payload, {
      timeout: 120000, // RAG retrieval + Gemini LLM generation can take a while
    });
    return response.data;
  },

  publishAssessment: async (assessmentId: string): Promise<any> => {
    const response = await apiClient.post(`/assessments/${assessmentId}/publish`);
    return response.data;
  },

  startAttempt: async (assessmentId: string, userId?: string): Promise<any> => {
    const response = await apiClient.post(`/assessments/${assessmentId}/attempts`, { user_id: userId });
    const data = response.data;
    // Normalize: backend returns attempt_id, map it to id as well
    return { ...data, id: data.attempt_id || data.id };
  },

  submitAttempt: async (attemptId: string, answers: Record<string, string>, userId?: string): Promise<any> => {
    const response = await apiClient.post(`/attempts/${attemptId}/submit`, {
      answers,
      user_id: userId
    });
    return response.data;
  },

  getAttemptResult: async (attemptId: string): Promise<any> => {
    const response = await apiClient.get(`/attempts/${attemptId}`);
    return response.data;
  },

  getLearnerAttempts: async (learnerId?: string): Promise<any[]> => {
    const response = await apiClient.get(`/learners/me/assessments`);
    return response.data;
  },

  verifyQuestion: async (assessmentId: string, questionId: string, isApproved: boolean = true): Promise<any> => {
    const response = await apiClient.post(`/assessments/${assessmentId}/questions/${questionId}/verify`, {
      is_approved: isApproved,
    });
    return response.data;
  },

  updateQuestion: async (assessmentId: string, questionId: string, payload: {
    question_text: string;
    explanation?: string;
    options: Array<{ id?: string; option_key: string; option_text: string; is_correct: boolean }>;
    is_trainer_approved?: boolean;
  }): Promise<any> => {
    const response = await apiClient.put(`/assessments/${assessmentId}/questions/${questionId}`, payload);
    return response.data;
  },

  deleteQuestion: async (assessmentId: string, questionId: string): Promise<any> => {
    const response = await apiClient.delete(`/assessments/${assessmentId}/questions/${questionId}`);
    return response.data;
  },

  addQuestion: async (assessmentId: string, payload: {
    question_text: string;
    explanation?: string;
    options: Array<{ option_key: string; option_text: string; is_correct: boolean }>;
    difficulty?: string;
  }): Promise<any> => {
    const response = await apiClient.post(`/assessments/${assessmentId}/questions`, payload);
    return response.data;
  },
};

export const materialApi = {
  getMaterials: async (): Promise<any[]> => {
    const response = await apiClient.get('/materials');
    return response.data;
  },

  uploadMaterial: async (payload: {
    title: string;
    description?: string;
    material_type?: string;
  }): Promise<any> => {
    const response = await apiClient.post('/materials', payload);
    return response.data;
  },

  deleteMaterial: async (materialId: string): Promise<any> => {
    const response = await apiClient.delete(`/materials/${materialId}`);
    return response.data;
  },
};
