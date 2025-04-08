
export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  location: string;
  tags: string[];
  price?: number; // Adding optional price field
  priceless?: boolean; // Adding priceless flag for sentimental items
}

export type ViewMode = 'grid' | 'list';
