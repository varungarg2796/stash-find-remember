
export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  location: string;
  tags: string[];
}

export type ViewMode = 'grid' | 'list';
