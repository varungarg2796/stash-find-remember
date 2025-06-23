import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/services/api/aiApi';
import { toast } from 'sonner';
import { ApiError } from '@/types';

export const useAskStasherMutation = () => {
  return useMutation({
    mutationFn: aiApi.askQuestion,
    onError: (err: ApiError) => {
      toast.error('AI Assistant Error', {
        description: err.response?.data?.message || err.message,
      });
    },
  });
};