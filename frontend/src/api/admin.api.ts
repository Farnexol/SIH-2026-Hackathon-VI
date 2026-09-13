import { apiClient } from './client';

export const adminApi = {
  getOverview: async (): Promise<any> => {
    const response = await apiClient.get('/admin/overview');
    return response.data;
  },

  getWorkforceAnalytics: async (): Promise<any> => {
    const response = await apiClient.get('/admin/overview');
    return response.data;
  },

  getDepartments: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/departments');
    return response.data;
  },

  getCompetencies: async (): Promise<any[]> => {
    const response = await apiClient.get('/competencies');
    return response.data;
  },

  getAdminCompetencyDistribution: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/competencies');
    return response.data;
  },

  getSkillGaps: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/skill-gaps');
    return response.data;
  },

  getUsers: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
};
