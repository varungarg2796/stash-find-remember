// Update your useAiQuery.ts file - fix the mutation function:

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiApi, AiResponse, QueryStatus } from '@/services/api/aiApi';
import { toast } from 'sonner';
import { ApiError } from '@/types';

export * from '@/services/api/aiApi'; // Re-export types

export const useQueryStatusQuery = (enabled: boolean = true) => {
  return useQuery<QueryStatus>({
    queryKey: ['ai-query-status'],
    queryFn: async () => {
      const response = await aiApi.getQueryStatus();
      return {
        ...response,
        resetTime: response.resetTime ? response.resetTime : undefined
      };
    },
    staleTime: 1000 * 30, // Consider fresh for 30 seconds
    refetchOnWindowFocus: true,
    enabled,
  });
};

export const useAskStasherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AiResponse, ApiError, string>({ // Add the generic types here
    mutationFn: (question: string) => aiApi.askQuestion(question), // Fix the function signature
    onSuccess: (data: AiResponse) => {
      // Update the query status cache with the response
      if (data.queryStatus) {
        queryClient.setQueryData(['ai-query-status'], data.queryStatus);
      }
    },
    onError: (err: ApiError) => {
      // If the error contains query status (quota exceeded), update the cache
      if (err.response?.data?.queryStatus) {
        queryClient.setQueryData(['ai-query-status'], err.response.data.queryStatus);
      }
      toast.error('AI Assistant Error', {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};