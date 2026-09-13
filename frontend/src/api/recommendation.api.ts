import { apiClient } from './client';
import { Course, Recommendation } from '../types';

export const courseApi = {
  getAllCourses: async (params?: { provider?: string; domain?: string }): Promise<Course[]> => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (courseId: string): Promise<Course> => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  },

  enrollCourse: async (courseId: string, learnerId: string) => {
    const response = await apiClient.post(`/courses/${courseId}/enroll`, { learner_id: learnerId });
    return response.data;
  },
};

export const recommendationApi = {
  getRecommendations: async (learnerId?: string): Promise<any> => {
    const response = await apiClient.get('/recommendations/me');
    return response.data;
  },

  generateRecommendations: async (learnerId?: string): Promise<any> => {
    const response = await apiClient.post('/recommendations/generate');
    return response.data;
  },
};
