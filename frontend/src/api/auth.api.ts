import { apiClient } from './client';
import { User } from '../types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  full_name: string;
  role: string;
  designation?: string;
}

export const authApi = {
  login: async (email: string, password = 'Password@123'): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<any> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
