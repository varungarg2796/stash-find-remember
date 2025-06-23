import { apiClient } from './apiClient';
import { Item } from '@/types';

// Type for the paginated response from GET /api/items
export interface PaginatedItemsResponse {
  data: Item[];
  totalPages: number;
  currentPage: number;
}

// Type for the query parameters for GET /api/items
export interface FindAllItemsParams {
  search?: string;
  location?: string;
  tag?: string;
  archived?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export const itemsApi = {
  // Use a query string builder for complex queries
  getAll: (params: FindAllItemsParams): Promise<PaginatedItemsResponse> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.append(key, String(value));
      }
    });
    return apiClient.get(`/items?${query.toString()}`);
  },

  getById: (id: string): Promise<Item> => {
    return apiClient.get(`/items/${id}`);
  },

  // The DTO for creating an item is defined in the frontend types
  create: (itemData: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item> => {
    return apiClient.post('/items', itemData);
  },

  update: (id: string, itemData: Partial<Item>): Promise<Item> => {
    return apiClient.patch(`/items/${id}`, itemData);
  },

  remove: (id: string): Promise<void> => {
    return apiClient.delete(`/items/${id}`);
  },

  bulkCreate: (items: Partial<Omit<Item, 'id' | 'createdAt'>>[]): Promise<{ message: string }> => {
    return apiClient.post('/items/bulk', { items });
  },

  archive: (id: string, note?: string): Promise<Item> => {
    return apiClient.post(`/items/${id}/archive`, { note });
  },
  restore: (id: string, note?: string): Promise<Item> => {
    return apiClient.post(`/items/${id}/restore`, { note });
  },
  gift: (id: string, note?: string): Promise<Item> => {
    return apiClient.post(`/items/${id}/gift`, { note });
  },
  use: (id: string, note?: string): Promise<Item> => {
    return apiClient.post(`/items/${id}/use`, { note });
  },
};