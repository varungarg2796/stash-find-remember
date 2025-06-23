import { apiClient } from './apiClient';

export const aiApi = {
  askQuestion: (question: string): Promise<{ answer: string }> => {
    return apiClient.post('/ai/ask', { question });
  },
};
