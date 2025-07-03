
import { apiClient } from './apiClient';
import { User } from '@/types';

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

  // Check username availability
  checkUsernameAvailability: (username: string): Promise<{ available: boolean }> => {
    return apiClient.get(`/users/check-username/${encodeURIComponent(username)}`);
  },
  
  // Update user profile
  updateProfile: (data: Partial<User>) => {
    return apiClient.patch<User>('/users/me', data);
  },
  
  // Update user preferences
  updatePreferences: (data: UpdatePreferencesPayload): Promise<User> => {
    return apiClient.patch('/users/me/preferences', data);
  },
  
};
