import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiApi, AnalysisStatus, AnalysisResponse } from '@/services/api/aiApi';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

export const ANALYSIS_QUERY_KEYS = {
  analysisStatus: ['analysisStatus'],
};

export const useAnalysisStatusQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ANALYSIS_QUERY_KEYS.analysisStatus,
    queryFn: aiApi.getAnalysisStatus,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute to keep status fresh
  });
};

export const useImageAnalysisMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: aiApi.analyzeImage,
    onSuccess: (data: AnalysisResponse) => {
      // Refetch analysis status to update remaining count
      queryClient.invalidateQueries({ queryKey: ANALYSIS_QUERY_KEYS.analysisStatus });
      // Note: Success toast is handled by the parent component to show applied suggestions
    },
    onError: (error: any) => {
      // Refetch status on error (might be quota exceeded)
      queryClient.invalidateQueries({ queryKey: ANALYSIS_QUERY_KEYS.analysisStatus });
      
      toast.error(getErrorMessage(error, 'Failed to analyze image. Please try again.'));
    }
  });
};

// Helper function to get time until reset in a human-readable format
export const getTimeUntilReset = (resetTime?: string): string => {
  if (!resetTime) return '';
  
  const now = new Date();
  const reset = new Date(resetTime);
  const diffMs = reset.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Soon';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  }
  return `${diffMinutes}m`;
};