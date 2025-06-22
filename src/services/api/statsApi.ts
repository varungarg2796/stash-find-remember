import { apiClient } from './apiClient';

// Define the shape of the data returned by the stats endpoint
export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  uniqueLocations: number;
  uniqueTags: number;
  locationDistribution: { name: string; count: number }[];
  tagDistribution: { name: string; count: number }[];
}

export const statsApi = {
  getDashboardStats: (): Promise<DashboardStats> => {
    return apiClient.get('/stats');
  },
};