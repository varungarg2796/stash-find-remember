import { apiClient } from './apiClient';

export const locationsApi = {
  create: (name: string) => {
    return apiClient.post('/locations', { name });
  },
  remove: (id: string) => {
    return apiClient.delete(`/locations/${id}`);
  },
};