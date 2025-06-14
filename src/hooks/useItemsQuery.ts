
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { Item } from '@/types';
import { toast } from 'sonner';

export const QUERY_KEYS = {
  items: ['items'] as const,
  item: (id: string) => ['items', id] as const,
  activeItems: ['items', 'active'] as const,
  archivedItems: ['items', 'archived'] as const,
};

// Get all items
export const useItemsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.items,
    queryFn: mockApi.getItems,
  });
};

// Get active items
export const useActiveItemsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.activeItems,
    queryFn: mockApi.getActiveItems,
  });
};

// Get archived items
export const useArchivedItemsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.archivedItems,
    queryFn: mockApi.getArchivedItems,
  });
};

// Get single item
export const useItemQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.item(id),
    queryFn: () => mockApi.getItem(id),
    enabled: !!id,
  });
};

// Create item mutation
export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      toast.success("Item added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add item");
      console.error("Error creating item:", error);
    },
  });
};

// Update item mutation
export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockApi.updateItem,
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedItems });
      queryClient.setQueryData(QUERY_KEYS.item(updatedItem.id), updatedItem);
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update item");
      console.error("Error updating item:", error);
    },
  });
};

// Delete item mutation
export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedItems });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete item");
      console.error("Error deleting item:", error);
    },
  });
};

// Archive item mutation
export const useArchiveItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => 
      mockApi.archiveItem(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedItems });
      toast.success("Item moved to archive");
    },
    onError: (error) => {
      toast.error("Failed to archive item");
      console.error("Error archiving item:", error);
    },
  });
};

// Restore item mutation
export const useRestoreItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => 
      mockApi.restoreItem(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedItems });
      toast.success("Item restored from archive");
    },
    onError: (error) => {
      toast.error("Failed to restore item");
      console.error("Error restoring item:", error);
    },
  });
};

// Use item mutation
export const useUseItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => 
      mockApi.useItem(id, note),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedItems });
      
      if (updatedItem.quantity > 0) {
        toast.success(`Used one ${updatedItem.name}`);
      } else {
        toast.success(`${updatedItem.name} moved to archive`);
      }
    },
    onError: (error) => {
      toast.error("Failed to use item");
      console.error("Error using item:", error);
    },
  });
};

// Gift item mutation
export const useGiftItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => 
      mockApi.giftItem(id, note),
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activeItems });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedItems });
      
      if (updatedItem.quantity > 0) {
        toast.success(`Gifted one ${updatedItem.name}`);
      } else {
        toast.success(`${updatedItem.name} moved to archive`);
      }
    },
    onError: (error) => {
      toast.error("Failed to gift item");
      console.error("Error gifting item:", error);
    },
  });
};
