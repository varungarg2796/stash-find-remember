import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, FindAllItemsParams } from '@/services/api/itemsApi';
import { toast } from 'sonner';
import { ApiError, Item } from '@/types';

// Define query keys for TanStack Query to manage caching
export const QUERY_KEYS = {
  items: (params: FindAllItemsParams) => ['items', params],
  item: (id: string) => ['items', id],
};

/**
 * Hook to fetch a paginated and filtered list of items from the backend.
 * @param params - The filter, sort, and pagination parameters.
 */
export const useItemsQuery = (params: FindAllItemsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.items(params),
    queryFn: () => itemsApi.getAll(params),
    placeholderData: (prev) => prev, // Provides a smoother UX during pagination
  });
};

/**
 * Hook to fetch a single item by its ID.
 * @param id - The ID of the item to fetch.
 */
export const useItemQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.item(id),
    queryFn: () => itemsApi.getById(id),
    enabled: !!id, // The query will not run until an ID is provided
  });
};

// --- MUTATIONS ---

export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      // Invalidate all 'items' queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item added successfully!');
    },
    onError: (err: ApiError) => {
      toast.error('Failed to add item', {
        description: Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : err.response?.data?.message || err.message,
      });
    },
  });
};

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) => itemsApi.update(id, data),
    onSuccess: (updatedItem) => {
      // Invalidate list queries to reflect the update
      queryClient.invalidateQueries({ queryKey: ['items'] });
      // Immediately update the cache for the single item view
      queryClient.setQueryData(QUERY_KEYS.item(updatedItem.id), updatedItem);
      toast.success('Item updated successfully!');
    },
    onError: (err: ApiError) => {
      toast.error('Failed to update item', {
        description: Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : err.response?.data?.message || err.message,
      });
    },
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item deleted successfully!');
    },
    onError: (err: ApiError) => {
      toast.error('Failed to delete item', { description: err.response?.data?.message || err.message });
    },
  });
};

export const useBulkCreateItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.bulkCreate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] }); // Also invalidate stats
      toast.success(data.message);
    },
    onError: (err: ApiError) => {
      toast.error('Bulk import failed', {
        description: Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : err.response?.data?.message || err.message,
      });
    },
  });
};

export const useArchiveItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => itemsApi.archive(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item archived.');
    },
    onError: (err: ApiError) => toast.error('Failed to archive item', { description: err.response?.data?.message || err.message }),
  });
};

export const useRestoreItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => itemsApi.restore(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item restored.');
    },
    onError: (err: ApiError) => toast.error('Failed to restore item', { description: err.response?.data?.message || err.message }),
  });
};