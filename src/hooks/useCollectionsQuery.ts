import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '@/services/api/collectionsApi';
import { toast } from 'sonner';
import { ApiError, Collection } from '@/types';
import { getErrorMessage } from '@/lib/utils';

export const QUERY_KEYS = {
  collections: ['collections'],
  collection: (id: string) => ['collections', id],
};

// --- QUERIES ---

export const useCollectionsQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.collections,
    queryFn: collectionsApi.getAll,
    enabled,
  });
};

export const useCollectionQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.collection(id),
    queryFn: () => collectionsApi.getById(id),
    enabled: !!id, // Only run if an ID is provided
  });
};

// --- MUTATIONS ---

export const useCreateCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collectionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
      toast.success('Collection created!');
    },
    onError: (err: ApiError) => toast.error('Failed to create', { description: getErrorMessage(err, 'Failed to create collection') }),
  });
};

export const useUpdateCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; data: { name?: string; description?: string; coverImage?: string } }) => 
      collectionsApi.update(params.id, params.data),
    onSuccess: (updatedCollection) => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
      queryClient.setQueryData(QUERY_KEYS.collection(updatedCollection.id), updatedCollection);
      toast.success('Collection updated.');
    },
    onError: (err: ApiError) => toast.error('Failed to update', { description: getErrorMessage(err, 'Failed to update collection') }),
  });
};

export const useDeleteCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collectionsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
      toast.success('Collection deleted.');
    },
    onError: (err: ApiError) => toast.error('Failed to delete', { description: getErrorMessage(err, 'Failed to delete collection') }),
  });
};

// --- NEW MUTATION HOOKS FOR DETAIL PAGE ---

export const useAddItemToCollectionMutation = (collectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) => collectionsApi.addItem(collectionId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collection(collectionId) });
            toast.success("Item added to collection.");
        },
        onError: (err: ApiError) => toast.error("Failed to add item", { description: getErrorMessage(err, 'Failed to add item to collection') }),
    });
};

export const useRemoveItemFromCollectionMutation = (collectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) => collectionsApi.removeItem(collectionId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collection(collectionId) });
            toast.success("Item removed from collection.");
        },
        onError: (err: ApiError) => toast.error("Failed to remove item", { description: getErrorMessage(err, 'Failed to remove item from collection') }),
    });
};

export const useReorderCollectionItemsMutation = (collectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (items: { itemId: string, order: number }[]) => collectionsApi.reorderItems(collectionId, items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collection(collectionId) });
            // No toast needed for a quiet reorder
        },
        onError: (err: ApiError) => toast.error("Failed to reorder items", { description: getErrorMessage(err, 'Failed to reorder collection items') }),
    });
};

export const useUpdateShareSettingsMutation = (collectionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (settings: unknown) => collectionsApi.updateShareSettings(collectionId, settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collection(collectionId) });
            toast.success("Sharing settings updated.");
        },
        onError: (err: ApiError) => toast.error("Failed to update settings", { description: getErrorMessage(err, 'Failed to update sharing settings') }),
    });
};