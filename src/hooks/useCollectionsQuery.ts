import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '@/services/api/collectionsApi';
import { toast } from 'sonner';
import { ApiError, Collection } from '@/types';

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
    onError: (err: ApiError) => toast.error('Failed to create', { description: err.response?.data?.message || err.message }),
  });
};

export const useUpdateCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collection: Collection) => collectionsApi.update(collection.id, collection),
    onSuccess: (updatedCollection) => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
      queryClient.setQueryData(QUERY_KEYS.collection(updatedCollection.id), updatedCollection);
      toast.success('Collection updated.');
    },
    onError: (err: ApiError) => toast.error('Failed to update', { description: err.response?.data?.message || err.message }),
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
    onError: (err: ApiError) => toast.error('Failed to delete', { description: err.response?.data?.message || err.message }),
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
        onError: (err: ApiError) => toast.error("Failed to add item", { description: err.response?.data?.message || err.message }),
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
        onError: (err: ApiError) => toast.error("Failed to remove item", { description: err.response?.data?.message || err.message }),
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
        onError: (err: ApiError) => toast.error("Failed to reorder items", { description: err.response?.data?.message || err.message }),
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
        onError: (err: ApiError) => toast.error("Failed to update settings", { description: err.response?.data?.message || err.message }),
    });
};