
import { Item, ItemHistory } from '@/types';

// Mock initial data - using your existing dummy data
const mockInitialItems: Item[] = [
  {
    id: "1",
    name: "Sweater",
    description: "Wool sweater received as a birthday gift",
    imageUrl: "/lovable-uploads/sweater.jpg",
    tags: ["Clothing"],
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
    tags: ["Book"],
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
    tags: ["Kitchen"],
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
    tags: ["Electronics"],
    quantity: 1,
    location: "Drawer",
    createdAt: new Date("2024-03-10"),
    expiryDate: new Date("2025-03-10"),
    history: [
      { id: "h4", action: "created", date: new Date("2024-03-10") }
    ]
  }
];

// In-memory storage for mock data
let mockItems: Item[] = [...mockInitialItems];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    await delay(300);
    return [...mockItems];
  },

  // Get a single item
  getItem: async (id: string): Promise<Item | null> => {
    await delay(200);
    const item = mockItems.find(item => item.id === id);
    return item || null;
  },

  // Create a new item
  createItem: async (newItem: Omit<Item, "id" | "createdAt" | "history">): Promise<Item> => {
    await delay(400);
    const now = new Date();
    const itemId = Date.now().toString();
    
    const item: Item = {
      ...newItem,
      id: itemId,
      createdAt: now,
      imageUrl: newItem.iconType ? "" : (newItem.imageUrl || "/lovable-uploads/earbuds.png"),
      iconType: newItem.iconType || null,
      history: [
        { id: Date.now().toString(), action: "created", date: now }
      ]
    };
    
    mockItems.push(item);
    return item;
  },

  // Update an item
  updateItem: async (updatedItem: Item): Promise<Item> => {
    await delay(300);
    const index = mockItems.findIndex(item => item.id === updatedItem.id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }

    const finalItem = {
      ...updatedItem,
      imageUrl: updatedItem.iconType ? "" : updatedItem.imageUrl,
      iconType: updatedItem.imageUrl ? null : updatedItem.iconType,
      history: [
        ...(updatedItem.history || []),
        { id: Date.now().toString(), action: "updated" as const, date: new Date() }
      ]
    };

    mockItems[index] = finalItem;
    return finalItem;
  },

  // Delete an item
  deleteItem: async (id: string): Promise<void> => {
    await delay(200);
    mockItems = mockItems.filter(item => item.id !== id);
  },

  // Archive an item
  archiveItem: async (id: string, note?: string): Promise<Item> => {
    await delay(300);
    const index = mockItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }

    const updatedItem = {
      ...mockItems[index],
      archived: true,
      history: [
        ...(mockItems[index].history || []),
        { id: Date.now().toString(), action: "archived" as const, date: new Date(), note }
      ]
    };

    mockItems[index] = updatedItem;
    return updatedItem;
  },

  // Restore an item
  restoreItem: async (id: string, note?: string): Promise<Item> => {
    await delay(300);
    const index = mockItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }

    const updatedItem = {
      ...mockItems[index],
      archived: false,
      history: [
        ...(mockItems[index].history || []),
        { id: Date.now().toString(), action: "updated" as const, date: new Date(), note: note || "Restored from archive" }
      ]
    };

    mockItems[index] = updatedItem;
    return updatedItem;
  },

  // Use an item (reduce quantity)
  useItem: async (id: string, note?: string): Promise<Item> => {
    await delay(300);
    const index = mockItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }

    const item = mockItems[index];
    
    if (item.quantity > 1) {
      const updatedItem = {
        ...item,
        quantity: item.quantity - 1,
        history: [
          ...(item.history || []),
          { id: Date.now().toString(), action: "used" as const, date: new Date(), note }
        ]
      };
      mockItems[index] = updatedItem;
      return updatedItem;
    } else {
      // Archive the last item
      return mockApi.archiveItem(id, note || "Last item used");
    }
  },

  // Gift an item (reduce quantity)
  giftItem: async (id: string, note?: string): Promise<Item> => {
    await delay(300);
    const index = mockItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }

    const item = mockItems[index];
    
    if (item.quantity > 1) {
      const updatedItem = {
        ...item,
        quantity: item.quantity - 1,
        history: [
          ...(item.history || []),
          { id: Date.now().toString(), action: "gifted" as const, date: new Date(), note }
        ]
      };
      mockItems[index] = updatedItem;
      return updatedItem;
    } else {
      // Archive the last item
      return mockApi.archiveItem(id, note || "Gifted to someone");
    }
  },

  // Get archived items
  getArchivedItems: async (): Promise<Item[]> => {
    await delay(200);
    return mockItems.filter(item => item.archived);
  },

  // Get active items
  getActiveItems: async (): Promise<Item[]> => {
    await delay(200);
    return mockItems.filter(item => !item.archived);
  }
};
