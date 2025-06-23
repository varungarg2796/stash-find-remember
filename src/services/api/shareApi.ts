import { apiClient } from './apiClient';

// Export this type so SharedCollection.tsx can use it
export interface PublicCollectionItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  iconType?: string;
  collectionNote?: string;
  quantity?: number;
  location?: string;
  price?: number;
  acquisitionDate?: string;
  tags?: string[];
}

// Export this type as well
export interface PublicCollection {
  name: string;
  description?: string;
  coverImage?: string;
  by: string;
  items: PublicCollectionItem[];
}

export const shareApi = {
  getSharedCollection: (shareId: string): Promise<PublicCollection> => {
    return apiClient.get(`/share/collection/${shareId}`);
  },
};