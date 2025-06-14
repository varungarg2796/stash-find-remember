
import React, { createContext, useContext } from "react";
import { Item, ItemHistory } from "@/types";
import { 
  useItemsQuery,
  useActiveItemsQuery,
  useArchivedItemsQuery,
  useItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useArchiveItemMutation,
  useRestoreItemMutation,
  useUseItemMutation,
  useGiftItemMutation
} from "@/hooks/useItemsQuery";

type ItemsContextType = {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "createdAt" | "history">) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  useItem: (id: string, note?: string) => void;
  giftItem: (id: string, note?: string) => void;
  archiveItem: (id: string, note?: string) => void;
  restoreItem: (id: string, note?: string) => void;
  addItemHistory: (itemId: string, action: ItemHistory['action'], note?: string) => void;
  getArchivedItems: () => Item[];
  getActiveItems: () => Item[];
  isLoading?: boolean;
  error?: Error | null;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  // Use TanStack Query hooks
  const { data: allItems = [], isLoading, error } = useItemsQuery();
  const { data: activeItems = [] } = useActiveItemsQuery();
  const { data: archivedItems = [] } = useArchivedItemsQuery();
  
  // Mutations
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const archiveItemMutation = useArchiveItemMutation();
  const restoreItemMutation = useRestoreItemMutation();
  const useItemMutation = useUseItemMutation();
  const giftItemMutation = useGiftItemMutation();

  const addItem = (newItem: Omit<Item, "id" | "createdAt" | "history">) => {
    createItemMutation.mutate(newItem);
  };

  const updateItem = (updatedItem: Item) => {
    updateItemMutation.mutate(updatedItem);
  };

  const deleteItem = (id: string) => {
    deleteItemMutation.mutate(id);
  };

  const getItem = (id: string) => {
    return allItems.find((item) => item.id === id);
  };

  const addItemHistory = (itemId: string, action: ItemHistory['action'], note?: string) => {
    const item = getItem(itemId);
    if (item) {
      const updatedItem = {
        ...item,
        history: [
          ...(item.history || []),
          { 
            id: Date.now().toString(), 
            action, 
            date: new Date(),
            note 
          }
        ]
      };
      updateItem(updatedItem);
    }
  };

  const useItem = (id: string, note?: string) => {
    useItemMutation.mutate({ id, note });
  };

  const giftItem = (id: string, note?: string) => {
    giftItemMutation.mutate({ id, note });
  };

  const archiveItem = (id: string, note?: string) => {
    archiveItemMutation.mutate({ id, note });
  };

  const restoreItem = (id: string, note?: string) => {
    restoreItemMutation.mutate({ id, note });
  };

  const getArchivedItems = () => {
    return archivedItems;
  };

  const getActiveItems = () => {
    return activeItems;
  };

  return (
    <ItemsContext.Provider
      value={{ 
        items: allItems, 
        addItem, 
        updateItem, 
        deleteItem, 
        getItem,
        useItem,
        giftItem,
        archiveItem,
        restoreItem,
        addItemHistory,
        getArchivedItems,
        getActiveItems,
        isLoading,
        error: error as Error | null
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
