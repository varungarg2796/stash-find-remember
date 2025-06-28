import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, FindAllItemsParams } from '@/services/api/itemsApi';
import { toast } from 'sonner';
import { ApiError, Item } from '@/types';
import { useMemo } from 'react';
import { getErrorMessage } from '@/lib/utils';

// Define query keys for TanStack Query to manage caching
export const QUERY_KEYS = {
  items: (params: FindAllItemsParams) => ['items', params],
  item: (id: string) => ['items', id],
};

/**
 * Helper function to filter items by price on the client side
 */
const filterItemsByPrice = (items: Item[], priceFilter: string) => {
  switch (priceFilter) {
    case 'priceless':
      return items.filter(item => item.priceless === true);
    case 'with-price':
      return items.filter(item => item.price !== undefined && item.price !== null && !item.priceless);
    case 'no-price':
      return items.filter(item => (item.price === undefined || item.price === null) && !item.priceless);
    default:
      return items;
  }
};

/**
 * Hook to fetch a paginated and filtered list of items from the backend.
 * @param params - The filter, sort, and pagination parameters.
 * @param enabled - Whether to enable the query (default: true)
 */
export const useItemsQuery = (params: FindAllItemsParams, enabled: boolean = true) => {
  // Separate the price filter from other params since backend might not support it yet
  const { priceFilter, ...backendParams } = params;
  
  const query = useQuery({
    queryKey: QUERY_KEYS.items(params),
    queryFn: () => itemsApi.getAll(backendParams),
    placeholderData: (prev) => prev, // Provides a smoother UX during pagination
    enabled,
  });

  // Apply client-side price filtering if needed
  const filteredData = useMemo(() => {
    if (!query.data || !priceFilter) {
      return query.data;
    }

    const filteredItems = filterItemsByPrice(query.data.data, priceFilter);
    
    return {
      ...query.data,
      data: filteredItems,
      totalPages: Math.ceil(filteredItems.length / (params.limit || 12)),
    };
  }, [query.data, priceFilter, params.limit]);

  return {
    ...query,
    data: filteredData,
  };
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
      const errorMessage = getErrorMessage(err, 'Failed to add item');
      toast.error('Failed to add item', {
        description: Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : errorMessage,
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
      const errorMessage = getErrorMessage(err, 'Failed to update item');
      toast.error('Failed to update item', {
        description: Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : errorMessage,
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
      toast.error('Failed to delete item', { description: getErrorMessage(err, 'Failed to delete item') });
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
      const errorMessage = getErrorMessage(err, 'Bulk import failed');
      toast.error('Bulk import failed', {
        description: Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : errorMessage,
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
    onError: (err: ApiError) => toast.error('Failed to archive item', { description: getErrorMessage(err, 'Failed to archive item') }),
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
    onError: (err: ApiError) => toast.error('Failed to restore item', { description: getErrorMessage(err, 'Failed to restore item') }),
  });
};

export const useGiftItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => itemsApi.gift(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Item marked as gifted.');
    },
    onError: (err: ApiError) => toast.error('Failed to mark item as gifted', { description: getErrorMessage(err, 'Failed to mark item as gifted') }),
  });
};

export const useUseItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => itemsApi.use(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Item marked as used.');
    },
    onError: (err: ApiError) => toast.error('Failed to mark item as used', { description: getErrorMessage(err, 'Failed to mark item as used') }),
  });
};