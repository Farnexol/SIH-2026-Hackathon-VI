import { apiClient } from './client';
import { CompetencyGap, GapAnalysisResponse } from '../types';

export const learnerApi = {
  getProfile: async (learnerId?: string) => {
    const response = await apiClient.get('/learners/me');
    return response.data;
  },

  getCompetencies: async (learnerId?: string) => {
    const response = await apiClient.get('/learners/me/competencies');
    return response.data;
  },

  getSkillGaps: async (learnerId?: string): Promise<CompetencyGap[]> => {
    const response = await apiClient.get('/learners/me/gaps');
    return response.data;
  },

  calculateGaps: async (learnerId: string): Promise<GapAnalysisResponse> => {
    const response = await apiClient.post(`/gaps/calculate/${learnerId}`);
    return response.data;
  },

  getProgressHistory: async (learnerId?: string) => {
    const response = await apiClient.get('/learners/me/progress');
    return response.data;
  },
};
