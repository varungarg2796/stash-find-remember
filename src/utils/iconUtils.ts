
import { 
  Book, 
  Armchair, 
  Monitor, 
  Laptop, 
  Tv, 
  Gift, 
  Heart, 
  Image as ImageIcon,
  Camera,
  LucideIcon
} from "lucide-react";

export interface IconOption {
  name: string;
  component: LucideIcon;
  label: string;
}

export const availableIcons: IconOption[] = [
  { name: "book", component: Book, label: "Book" },
  { name: "armchair", component: Armchair, label: "Furniture" },
  { name: "monitor", component: Monitor, label: "Monitor" },
  { name: "laptop", component: Laptop, label: "Laptop" },
  { name: "tv", component: Tv, label: "TV" },
  { name: "gift", component: Gift, label: "Gift" },
  { name: "heart", component: Heart, label: "Heart" },
  { name: "image", component: ImageIcon, label: "Image" },
  { name: "camera", component: Camera, label: "Camera" }
];

export const getIconByName = (name: string | undefined | null): LucideIcon | null => {
  if (!name) return null;
  
  const iconOption = availableIcons.find(icon => icon.name === name);
  return iconOption ? iconOption.component : null;
};

// Function to generate a consistent color based on item name
export const getColorForItem = (name: string): string => {
  const colors = [
    "bg-blue-200", "bg-green-200", "bg-yellow-200", 
    "bg-red-200", "bg-purple-200", "bg-pink-200",
    "bg-indigo-200", "bg-teal-200", "bg-orange-200"
  ];
  
  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get positive value
  hash = Math.abs(hash);
  
  // Get index in color array
  const index = hash % colors.length;
  
  return colors[index];
};
