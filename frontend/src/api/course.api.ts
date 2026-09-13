import { apiClient } from './client';
import type { Course } from '../types';

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
