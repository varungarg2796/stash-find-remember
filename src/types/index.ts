
export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  location: string;
  tags: string[];
  price?: number;
  priceless?: boolean;
  createdAt: Date;
  archived?: boolean;
  history?: ItemHistory[];
}

export interface ItemHistory {
  id: string;
  action: 'created' | 'updated' | 'gifted' | 'archived' | 'deleted' | 'used';
  date: Date;
  note?: string;
}

export type ViewMode = 'grid' | 'list';

export interface UserPreferences {
  theme?: "light" | "dark";
  currency?: string;
  locations?: string[];
  tags?: string[];
}
