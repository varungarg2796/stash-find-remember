
import { apiClient } from './apiClient';
import { UserPreferences } from '@/types';

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export const userApi = {
  // Get current user profile
  getCurrentUser: () => {
    return apiClient.get<User>('/users/me');
  },
  
  // Update user profile
  updateProfile: (data: Partial<User>) => {
    return apiClient.patch<User>('/users/me', data);
  },
  
  // Update user preferences
  updatePreferences: (preferences: UserPreferences) => {
    return apiClient.patch<User>('/users/me/preferences', { preferences });
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
