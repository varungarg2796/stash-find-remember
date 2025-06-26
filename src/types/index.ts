
export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  iconType?: string;
  quantity: number;
  location: string;
  tags: string[];
  price?: number;
  priceless?: boolean;
  createdAt: Date;
  archived?: boolean;
  history?: ItemHistory[];
  acquisitionDate?: Date;
  expiryDate?: Date;
  historyNote?: string;

}

export interface ItemHistory {
  id: string;
  action: 'created' | 'updated' | 'gifted' | 'archived' | 'deleted' | 'used';
  date: Date;
  note?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  items: {
    collectionNote?: string;
    order: number;
    item: Item;
  }[];
  shareSettings: ShareSettings;
  createdAt: Date;
  updatedAt: Date;
  by: string; // Username of the collection owner
}

export interface CollectionItem {
  itemId: string;
  collectionNote?: string;
  order: number;
}

export interface ShareSettings {
  isEnabled: boolean;
  shareId: string;
  visibilityLevel: 'public' | 'password';
  password?: string;
  displaySettings: {
    showDescription: boolean;
    showQuantity: boolean;
    showLocation: boolean;
    showTags: boolean;
    showPrice: boolean;
    showAcquisitionDate: boolean;
  };
  allowComments: boolean;
  allowContact: boolean;
  contactInfo?: string;
  expiryDate?: Date;
}

export type ViewMode = 'grid' | 'list';

export interface UserPreferences {
  currency?: string;
  locations?: string[];
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  plan: 'FREE' | 'PREMIUM';
  currency?: string;
  // The 'locations' and 'tags' will now be objects with an 'id' and 'name'
  locations: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  usage: {
    itemCount: number;
    itemLimit: number;
    locationCount: number;
    locationLimit: number;
    tagCount: number;
    tagLimit: number;
  };
}
export interface ApiError {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  queryStatus?: {
    remaining: number;
    total: number;
    resetTime?: string;
  };
  response?: {
    data?: {
      message?: string | string[];
      error?: string;
      statusCode?: number;
      queryStatus?: {
        remaining: number;
        total: number;
        resetTime?: string;
      };
    };
  };
}
