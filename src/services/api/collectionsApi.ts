import { apiClient } from './apiClient';
import { Collection, Item } from '@/types';

// The backend returns this when we get a single collection
type FullCollection = Collection & {
  items: {
    collectionNote?: string;
    order: number;
    item: Item;
  }[];
  shareSettings: unknown; // Use a more specific type if you have one
};

type CollectionWithCount = Collection & {
  _count: {
    items: number;
  };
};

interface CreateCollectionPayload {
  name: string;
  description?: string;
}

interface UpdateCollectionPayload {
  name?: string;
  description?: string;
  coverImage?: string;
}

interface ReorderPayload {
  itemId: string;
  order: number;
}

export const collectionsApi = {
  getAll: (): Promise<CollectionWithCount[]> => {
    return apiClient.get('/collections');
  },

  getById: (id: string): Promise<FullCollection> => {
    return apiClient.get(`/collections/${id}`);
  },

  create: (data: CreateCollectionPayload): Promise<Collection> => {
    return apiClient.post('/collections', data);
  },
  
  update: (id: string, data: UpdateCollectionPayload): Promise<Collection> => {
    return apiClient.patch(`/collections/${id}`, data);
  },

  remove: (id: string): Promise<void> => {
    return apiClient.delete(`/collections/${id}`);
  },

  // --- NEW FUNCTIONS FOR THE DETAIL PAGE ---
  
  addItem: (collectionId: string, itemId: string) => {
    return apiClient.post(`/collections/${collectionId}/items`, { itemId });
  },

  removeItem: (collectionId: string, itemId: string) => {
    return apiClient.delete(`/collections/${collectionId}/items/${itemId}`);
  },

  reorderItems: (collectionId: string, items: ReorderPayload[]) => {
    return apiClient.put(`/collections/${collectionId}/items/reorder`, { items });
  },

  updateShareSettings: (collectionId: string, settings: unknown) => {
    return apiClient.patch(`/collections/${collectionId}/share`, settings);
  },
};