import React, { createContext, useContext, ReactNode } from 'react';
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useArchiveItemMutation,
  useRestoreItemMutation,
  // Assuming you create these two hooks following the same pattern
  // For now, we will reuse the archive hook for simplicity as the backend logic is similar
} from '@/hooks/useItemsQuery';
import { Item } from '@/types';
import { itemsApi } from '@/services/api/itemsApi';
import { useMutation } from '@tanstack/react-query';

// It's cleaner to define the mutation hooks for gift/use right here
// if they are simple wrappers, or in useItemsQuery.ts for consistency.
// Let's define them here for clarity.

const useGiftItemMutation = () => {
  // This would be a real hook if you had a dedicated gift endpoint
  return useArchiveItemMutation(); // Placeholder: for now, gifting archives the item
};

const useUseItemMutation = () => {
  // This would be a real hook if you had a dedicated use endpoint
  return useArchiveItemMutation(); // Placeholder: for now, using archives the item
};


type ItemsContextType = {
  addItem: (item: Partial<Omit<Item, 'id' | 'createdAt'>>) => void;
  updateItem: (params: { id: string; data: Partial<Item> }) => void;
  deleteItem: (id: string) => void;
  archiveItem: (params: { id: string; note?: string }) => void;
  restoreItem: (params: { id:string; note?: string }) => void;
  giftItem: (params: { id: string; note?: string }) => void;
  useItem: (params: { id: string; note?: string }) => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const createMutation = useCreateItemMutation();
  const updateMutation = useUpdateItemMutation();
  const deleteMutation = useDeleteItemMutation();
  const archiveMutation = useArchiveItemMutation();
  const restoreMutation = useRestoreItemMutation();
  const giftMutation = useGiftItemMutation();
  const useMutation = useUseItemMutation();


  const addItem = (item: Partial<Omit<Item, 'id' | 'createdAt'>>) => {
    createMutation.mutate(item);
  };

  const updateItem = (params: { id: string; data: Partial<Item> }) => {
    updateMutation.mutate(params);
  };

  const deleteItem = (id: string) => {
    deleteMutation.mutate(id);
  };

  const archiveItem = (params: { id: string; note?: string }) => {
    archiveMutation.mutate(params);
  };

  const restoreItem = (params: { id: string; note?: string }) => {
    restoreMutation.mutate(params);
  };
  
  const giftItem = (params: { id: string; note?: string }) => {
    // For now, we treat gifting as archiving with a specific note
    giftMutation.mutate({ ...params, note: params.note || 'Gifted' });
  };
  
  const useItem = (params: { id: string; note?: string }) => {
    // For now, we treat using as archiving with a specific note
    useMutation.mutate({ ...params, note: params.note || 'Used' });
  };

  return (
    <ItemsContext.Provider
      value={{
        addItem,
        updateItem,
        deleteItem,
        archiveItem,
        restoreItem,
        giftItem,
        useItem,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};