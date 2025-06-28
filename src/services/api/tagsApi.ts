import { apiClient } from './apiClient';

export const tagsApi = {
  create: (name: string) => {
    return apiClient.post('/tags', { name });
  },
  remove: (id: string) => {
    return apiClient.delete(`/tags/${id}`);
  },
};