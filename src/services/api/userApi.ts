
import { apiClient } from './apiClient';
import { UserPreferences, User } from '@/types';

interface UpdatePreferencesPayload {
  username?: string;
  currency?: string;
  locations?: string[];
  tags?: string[];
}

export const userApi = {
  // Get current user profile
  getCurrentUser: (): Promise<User> => {
    return apiClient.get('/users/me');
  },
  
  // Update user profile
  updateProfile: (data: Partial<User>) => {
    return apiClient.patch<User>('/users/me', data);
  },
  
  // Update user preferences
  updatePreferences: (data: UpdatePreferencesPayload): Promise<User> => {
    return apiClient.patch('/users/me/preferences', data);
  },
  
  // Save user tags
  saveUserTags: (tags: string[]) => {
    return apiClient.patch<User>('/users/me/tags', { tags });
  },
  
  // Save user locations
  saveUserLocations: (locations: string[]) => {
    return apiClient.patch<User>('/users/me/locations', { locations });
  }
};
