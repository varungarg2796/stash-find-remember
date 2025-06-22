import { apiClient } from './apiClient';
import { Collection } from '@/types'; // Assuming Collection type is in your central types file

export const collectionsApi = {
  getAll: (): Promise<Collection[]> => {
    return apiClient.get('/collections');
  },
  // Add other collection functions here later as needed
};