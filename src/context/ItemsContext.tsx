import React, { createContext, useContext, useState } from "react";
import { Item, ItemHistory } from "@/types";
import { toast } from "sonner";

// Mock initial data
const initialItems: Item[] = [
  {
    id: "1",
    name: "Sweater",
    description: "Wool sweater received as a birthday gift",
    imageUrl: "/lovable-uploads/sweater.jpg",
    tags: ["Clothing", "Gift"],
    quantity: 1,
    location: "Wardrobe",
    createdAt: new Date("2023-12-15"),
    history: [
      { id: "h1", action: "created", date: new Date("2023-12-15") }
    ]
  },
  {
    id: "2",
    name: "Cookbook",
    description: "Italian cuisine cookbook",
    imageUrl: "/lovable-uploads/cookbook.jpg",
    tags: ["Books", "Christmas"],
    quantity: 1,
    location: "Bookshelf",
    createdAt: new Date("2024-01-20"),
    history: [
      { id: "h2", action: "created", date: new Date("2024-01-20") }
    ]
  },
  {
    id: "3",
    name: "Wine Glasses",
    description: "Crystal wine glasses, set of 2",
    imageUrl: "/lovable-uploads/wine-glasses.jpg",
    tags: ["Glassware", "Set"],
    quantity: 2,
    location: "Kitchen",
    createdAt: new Date("2024-02-05"),
    history: [
      { id: "h3", action: "created", date: new Date("2024-02-05") }
    ]
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    description: "Noise cancelling wireless earbuds",
    imageUrl: "/lovable-uploads/earbuds.jpg",
    tags: ["Electronics", "Prize"],
    quantity: 1,
    location: "Drawer",
    createdAt: new Date("2024-03-10"),
    expiryDate: new Date("2025-03-10"), // Example expiry date
    history: [
      { id: "h4", action: "created", date: new Date("2024-03-10") }
    ]
  }
];

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
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addItem = (newItem: Omit<Item, "id" | "createdAt" | "history">) => {
    const now = new Date();
    const itemId = Date.now().toString();
    
    const item = {
      ...newItem,
      id: itemId,
      createdAt: now,
      // Ensure we don't set both imageUrl and iconType
      imageUrl: newItem.iconType ? "" : (newItem.imageUrl || "/lovable-uploads/earbuds.png"),
      iconType: newItem.iconType || null,
      history: [
        { id: Date.now().toString(), action: "created" as const, date: now }
      ]
    };
    
    console.log("Adding item:", item); // Debug log
    
    setItems((prevItems) => [...prevItems, item]);
    toast.success("Item added successfully");
  };

  const updateItem = (updatedItem: Item) => {
    console.log("Updating item:", updatedItem); // Debug log
    
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          // Add history entry for update if needed
          const updatedHistory = updatedItem.history || [];
          
          // If history has not been manually modified, add an update entry
          if (!didHistoryChange(item.history || [], updatedHistory)) {
            updatedItem.history = [
              ...updatedHistory,
              { id: Date.now().toString(), action: "updated", date: new Date() }
            ];
          }
          
          // Ensure we don't set both imageUrl and iconType
          const finalItem = {
            ...updatedItem,
            imageUrl: updatedItem.iconType ? "" : updatedItem.imageUrl,
            iconType: updatedItem.imageUrl ? null : updatedItem.iconType,
          };
          
          console.log("Final updated item:", finalItem); // Debug log
          return finalItem;
        }
        return item;
      })
    );
    toast.success("Item updated successfully");
  };

  const didHistoryChange = (oldHistory: ItemHistory[], newHistory: ItemHistory[]) => {
    // Check if history was explicitly modified (length changed or different entries)
    if (oldHistory.length !== newHistory.length) return true;
    
    // Compare IDs to see if they are the same entries
    const oldIds = oldHistory.map(h => h.id).sort();
    const newIds = newHistory.map(h => h.id).sort();
    
    return oldIds.some((id, index) => id !== newIds[index]);
  };

  const deleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const getItem = (id: string) => {
    return items.find((item) => item.id === id);
  };

  const addItemHistory = (itemId: string, action: ItemHistory['action'], note?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const history = item.history || [];
          return {
            ...item,
            history: [
              ...history,
              { 
                id: Date.now().toString(), 
                action, 
                date: new Date(),
                note 
              }
            ]
          };
        }
        return item;
      })
    );
  };

  const useItem = (id: string, note?: string) => {
    const item = getItem(id);
    if (!item) return;

    if (item.quantity > 1) {
      // Reduce quantity
      updateItem({
        ...item,
        quantity: item.quantity - 1,
        history: [
          ...(item.history || []),
          { id: Date.now().toString(), action: "used", date: new Date(), note }
        ]
      });
      toast.success(`Used one ${item.name}`);
    } else {
      // Archive the last item
      archiveItem(id, note || "Last item used");
    }
  };

  const giftItem = (id: string, note?: string) => {
    const item = getItem(id);
    if (!item) return;

    if (item.quantity > 1) {
      // Reduce quantity
      updateItem({
        ...item,
        quantity: item.quantity - 1,
        history: [
          ...(item.history || []),
          { id: Date.now().toString(), action: "gifted", date: new Date(), note }
        ]
      });
      toast.success(`Gifted one ${item.name}`);
    } else {
      // Archive the last item with gifted status
      archiveItem(id, note || "Gifted to someone");
    }
  };

  const archiveItem = (id: string, note?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            archived: true,
            history: [
              ...(item.history || []),
              { id: Date.now().toString(), action: "archived", date: new Date(), note }
            ]
          };
        }
        return item;
      })
    );
    toast.success("Item moved to archive");
  };

  const restoreItem = (id: string, note?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            archived: false,
            history: [
              ...(item.history || []),
              { id: Date.now().toString(), action: "updated", date: new Date(), note: note || "Restored from archive" }
            ]
          };
        }
        return item;
      })
    );
    toast.success("Item restored from archive");
  };

  const getArchivedItems = () => {
    return items.filter(item => item.archived);
  };

  const getActiveItems = () => {
    return items.filter(item => !item.archived);
  };

  return (
    <ItemsContext.Provider
      value={{ 
        items, 
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
        getActiveItems
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
