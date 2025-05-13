
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
  ShoppingBag,
  Utensils,
  Shirt,
  Gamepad2,
  Dumbbell,
  Smartphone,
  Watch,
  Tent,
  Wrench,
  Briefcase,
  Baby,
  Plane,
  PawPrint,
  Bike,
  Music,
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
  { name: "camera", component: Camera, label: "Camera" },
  { name: "shirt", component: Shirt, label: "Clothing" },
  { name: "shoppingbag", component: ShoppingBag, label: "Shopping" },
  { name: "utensils", component: Utensils, label: "Kitchen" },
  { name: "gamepad", component: Gamepad2, label: "Gaming" },
  { name: "dumbbell", component: Dumbbell, label: "Fitness" },
  { name: "smartphone", component: Smartphone, label: "Phone" },
  { name: "watch", component: Watch, label: "Accessories" },
  { name: "tent", component: Tent, label: "Outdoor" },
  { name: "wrench", component: Wrench, label: "Tools" },
  { name: "briefcase", component: Briefcase, label: "Office" },
  { name: "baby", component: Baby, label: "Baby" },
  { name: "plane", component: Plane, label: "Travel" },
  { name: "pawprint", component: PawPrint, label: "Pet" },
  { name: "bike", component: Bike, label: "Sports" },
  { name: "music", component: Music, label: "Music" }
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

// Function to get an icon based on a tag
export const getIconForTag = (tag: string): string | null => {
  const tagToIconMap: Record<string, string> = {
    "book": "book",
    "books": "book",
    "reading": "book",
    "furniture": "armchair",
    "sofa": "armchair",
    "chair": "armchair",
    "table": "armchair",
    "monitor": "monitor",
    "display": "monitor",
    "computer": "laptop",
    "laptop": "laptop",
    "notebook": "laptop",
    "television": "tv",
    "tv": "tv",
    "gift": "gift",
    "present": "gift",
    "memento": "heart",
    "clothing": "shirt",
    "shirt": "shirt",
    "clothes": "shirt",
    "t-shirt": "shirt",
    "kitchen": "utensils",
    "cooking": "utensils",
    "cutlery": "utensils",
    "food": "utensils",
    "gaming": "gamepad",
    "game": "gamepad",
    "console": "gamepad",
    "videogame": "gamepad",
    "fitness": "dumbbell",
    "workout": "dumbbell",
    "exercise": "dumbbell",
    "gym": "dumbbell",
    "phone": "smartphone",
    "mobile": "smartphone",
    "smartphone": "smartphone",
    "accessories": "watch",
    "watch": "watch",
    "jewelry": "watch",
    "outdoor": "tent",
    "camping": "tent",
    "hiking": "tent",
    "tools": "wrench",
    "tool": "wrench",
    "hardware": "wrench",
    "office": "briefcase",
    "work": "briefcase",
    "business": "briefcase",
    "baby": "baby",
    "infant": "baby",
    "child": "baby",
    "travel": "plane",
    "vacation": "plane",
    "trip": "plane",
    "pet": "pawprint",
    "dog": "pawprint",
    "cat": "pawprint",
    "animal": "pawprint",
    "sports": "bike",
    "bicycle": "bike",
    "cycling": "bike",
    "music": "music",
    "audio": "music",
    "instrument": "music",
    "camera": "camera",
    "photography": "camera",
    "photo": "camera",
    "image": "image",
    "picture": "image"
  };

  if (!tag) return null;
  
  const normalizedTag = tag.toLowerCase().trim();
  return tagToIconMap[normalizedTag] || null;
};

