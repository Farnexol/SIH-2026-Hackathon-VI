import { apiClient } from './client';

export const assistantApi = {
  chat: async (message: string, context?: Record<string, any>): Promise<{ reply: string; suggestions?: string[] }> => {
    const response = await apiClient.post('/assistant/chat', {
      query: message,
      context: context || {},
    });
    return response.data;
  },
};
