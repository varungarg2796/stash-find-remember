// Update your aiApi.ts file:

import { apiClient } from './apiClient';

export interface FoundItem {
  id: string;
  name: string;
  location?: string;
  image?: string;
  tags?: string[];
  quantity?: number;
  description?: string;
}

export interface QueryStatus {
  remaining: number;
  total: number;
  resetTime?: string; // ISO string from backend
}

export interface AiResponse {
  answer: string;
  foundItems?: FoundItem[];
  queryStatus: QueryStatus;
  responseTime?: number; // in milliseconds
}

export const aiApi = {
  askQuestion: (question: string): Promise<AiResponse> => {
    return apiClient.post('/ai/ask', { question });
  },

  getQueryStatus: (): Promise<QueryStatus> => {
    return apiClient.get('/ai/query-status');
  },
};