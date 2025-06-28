import React, { createContext, useContext, ReactNode } from 'react';
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useArchiveItemMutation,
  useRestoreItemMutation,
  useGiftItemMutation,
  useUseItemMutation,
} from '@/hooks/useItemsQuery';
import { Item } from '@/types';
import { itemsApi } from '@/services/api/itemsApi';
import { useMutation } from '@tanstack/react-query';



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
  const useItemMutation = useUseItemMutation();


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
    giftMutation.mutate(params);
  };
  
  const useItem = (params: { id: string; note?: string }) => {
    useItemMutation.mutate(params);
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
    // Add more debugging info for mobile issues
    console.error('useItems called outside ItemsProvider. Current component stack:', Error().stack);
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};