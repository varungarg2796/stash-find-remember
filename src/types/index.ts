
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
  items: CollectionItem[];
  shareSettings: ShareSettings;
  createdAt: Date;
  updatedAt: Date;
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
  theme?: "light" | "dark";
  currency?: string;
  locations?: string[];
  tags?: string[];
}
