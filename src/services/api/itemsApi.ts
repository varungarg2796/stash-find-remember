
import { apiClient } from './apiClient';
import { Item } from '@/types';

export const itemsApi = {
  // Get all items
  getItems: () => {
    return apiClient.get<Item[]>('/items');
  },
  
  // Get a single item by ID
  getItem: (id: string) => {
    return apiClient.get<Item>(`/items/${id}`);
  },
  
  // Create a new item
  createItem: (item: Omit<Item, 'id' | 'createdAt' | 'history'>) => {
    return apiClient.post<Item>('/items', item);
  },
  
  // Update an existing item
  updateItem: (item: Item) => {
    return apiClient.put<Item>(`/items/${item.id}`, item);
  },
  
  // Archive an item
  archiveItem: (id: string, note?: string) => {
    return apiClient.patch<Item>(`/items/${id}/archive`, { note });
  },
  
  // Use an item (reduce quantity)
  useItem: (id: string, note?: string) => {
    return apiClient.patch<Item>(`/items/${id}/use`, { note });
  },
  
  // Gift an item (reduce quantity)
  giftItem: (id: string, note?: string) => {
    return apiClient.patch<Item>(`/items/${id}/gift`, { note });
  },
  
  // Delete an item permanently
  deleteItem: (id: string) => {
    return apiClient.delete<void>(`/items/${id}`);
  },
  
  // Get archived items
  getArchivedItems: () => {
    return apiClient.get<Item[]>('/items/archived');
  },
  
  // Get active (non-archived) items
  getActiveItems: () => {
    return apiClient.get<Item[]>('/items/active');
  }
};
