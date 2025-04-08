
import React, { createContext, useContext, useState } from "react";
import { Item } from "@/types";
import { toast } from "sonner";

// Mock initial data
const initialItems: Item[] = [
  {
    id: "1",
    name: "Sweater",
    description: "Wool sweater received as a birthday gift",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Clothing", "Gift"],
    quantity: 1,
    location: "Wardrobe"
  },
  {
    id: "2",
    name: "Cookbook",
    description: "Italian cuisine cookbook",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Books", "Christmas"],
    quantity: 1,
    location: "Bookshelf"
  },
  {
    id: "3",
    name: "Wine Glasses",
    description: "Crystal wine glasses, set of 2",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Glassware", "Set"],
    quantity: 2,
    location: "Kitchen"
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    description: "Noise cancelling wireless earbuds",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Electronics", "Prize"],
    quantity: 1,
    location: "Drawer"
  }
];

type ItemsContextType = {
  items: Item[];
  addItem: (item: Omit<Item, "id">) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addItem = (newItem: Omit<Item, "id">) => {
    const item = {
      ...newItem,
      id: Date.now().toString(), // Simple ID generation for the POC
    };
    setItems((prevItems) => [...prevItems, item]);
    toast.success("Item added successfully");
  };

  const updateItem = (updatedItem: Item) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    toast.success("Item updated successfully");
  };

  const deleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const getItem = (id: string) => {
    return items.find((item) => item.id === id);
  };

  return (
    <ItemsContext.Provider
      value={{ items, addItem, updateItem, deleteItem, getItem }}
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
