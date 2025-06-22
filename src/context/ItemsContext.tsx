import React, { createContext, useContext, ReactNode } from 'react';
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from '@/hooks/useItemsQuery';
import { Item } from '@/types';

type ItemsContextType = {
  addItem: (item: Partial<Omit<Item, 'id'>>) => void;
  updateItem: (params: { id: string; data: Partial<Item> }) => void;
  deleteItem: (id: string) => void;
  // --- ADD THESE BACK ---
  archiveItem: (id: string, note?: string) => void;
  restoreItem: (id: string, note?: string) => void;
  giftItem: (id: string, note?: string) => void;
  useItem: (id: string, note?: string) => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const createMutation = useCreateItemMutation();
  const updateMutation = useUpdateItemMutation();
  const deleteMutation = useDeleteItemMutation();
  
  // You would need to create these mutation hooks in useItemsQuery.ts
  // For now, let's use the update mutation as a placeholder
  const archiveMutation = useUpdateItemMutation(); 
  const restoreMutation = useUpdateItemMutation();
  const giftMutation = useUpdateItemMutation();
  const useMutation = useUpdateItemMutation();


  const addItem = (item: Partial<Omit<Item, 'id'>>) => createMutation.mutate(item);
  const updateItem = (params: { id: string; data: Partial<Item> }) => updateMutation.mutate(params);
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  // --- IMPLEMENT THE FUNCTIONS ---
  const archiveItem = (id: string, note?: string) => {
    archiveMutation.mutate({ id, data: { archived: true, historyNote: note || 'Archived' } });
  };
  const restoreItem = (id: string, note?: string) => {
    restoreMutation.mutate({ id, data: { archived: false, historyNote: note || 'Restored' } });
  };
  const giftItem = (id: string, note?: string) => {
    // This logic is more complex (decrement quantity, archive if last one)
    // and should ideally be a dedicated backend endpoint.
    // For now, we simulate by archiving.
    giftMutation.mutate({ id, data: { archived: true, historyNote: note || 'Gifted' } });
  };
  const useItem = (id: string, note?: string) => {
    useMutation.mutate({ id, data: { archived: true, historyNote: note || 'Used' } });
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