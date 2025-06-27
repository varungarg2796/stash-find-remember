import { 
  // Electronics & Technology
  Monitor, 
  Laptop, 
  Tv, 
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Mic,
  Cpu,
  
  // Furniture & Home
  Home,
  Sofa,
  Bed,
  Lamp,
  
  // Clothing & Fashion
  Shirt,
  ShoppingBag,
  
  // Kitchen & Dining
  Utensils,
  Coffee,
  
  // Tools & Hardware
  Wrench,
  Hammer,
  
  // Sports & Recreation
  Gamepad2,
  Dumbbell,
  Bike,
  Trophy,
  Target,
  
  // Books & Education
  Book,
  Calculator,
  Pen,
  
  // Media & Entertainment
  Film,
  Music,
  Image as ImageIcon,
  
  // Baby & Kids
  Baby,
  
  // Travel & Outdoor
  Plane,
  Car,
  Tent,
  
  // Pets
  PawPrint,
  
  // Storage & Organization
  Box,
  Package,
  Archive,
  Folder,
  
  // Office & Work
  Briefcase,
  
  // General Items
  Gift,
  Heart,
  Tag,
  
  // Medical & Health
  Pill,
  Stethoscope,
  
  // Kitchen Appliances
  Microwave,
  
  // Cleaning & Maintenance
  // Automotive
  Car as CarIcon,
  Fuel,
  
  // Garden & Outdoor
  Flower,
  TreePine,
  
  LucideIcon
} from "lucide-react";

export interface IconOption {
  name: string;
  component: LucideIcon;
  label: string;
  category: string;
  keywords: string[];
  commonUse: string[];
}

export const inventoryIcons: IconOption[] = [
  // Electronics & Technology
  { 
    name: "laptop", 
    component: Laptop, 
    label: "Laptop", 
    category: "Electronics", 
    keywords: ["computer", "notebook", "portable", "tech"],
    commonUse: ["MacBook", "Dell laptop", "gaming laptop", "work computer"]
  },
  { 
    name: "monitor", 
    component: Monitor, 
    label: "Monitor", 
    category: "Electronics", 
    keywords: ["screen", "display", "computer", "desk"],
    commonUse: ["computer monitor", "external display", "gaming monitor", "4K display"]
  },
  { 
    name: "smartphone", 
    component: Smartphone, 
    label: "Phone", 
    category: "Electronics", 
    keywords: ["mobile", "cell", "device", "tech"],
    commonUse: ["iPhone", "Android phone", "cell phone", "mobile device"]
  },
  { 
    name: "tv", 
    component: Tv, 
    label: "TV", 
    category: "Electronics", 
    keywords: ["television", "screen", "entertainment", "smart"],
    commonUse: ["smart TV", "television", "LED TV", "streaming device"]
  },
  { 
    name: "watch", 
    component: Watch, 
    label: "Watch", 
    category: "Electronics", 
    keywords: ["smartwatch", "timepiece", "wearable", "fitness"],
    commonUse: ["Apple Watch", "fitness tracker", "smart watch", "wristwatch"]
  },
  { 
    name: "camera", 
    component: Camera, 
    label: "Camera", 
    category: "Electronics", 
    keywords: ["photography", "photo", "picture", "lens"],
    commonUse: ["DSLR camera", "digital camera", "action camera", "webcam"]
  },
  { 
    name: "headphones", 
    component: Headphones, 
    label: "Headphones", 
    category: "Electronics", 
    keywords: ["audio", "music", "sound", "earphones"],
    commonUse: ["wireless headphones", "gaming headset", "earbuds", "noise-canceling"]
  },
  { 
    name: "cpu", 
    component: Cpu, 
    label: "Electronics", 
    category: "Electronics", 
    keywords: ["processor", "computer parts", "tech", "components"],
    commonUse: ["computer parts", "electronic components", "circuit boards", "processors"]
  },

  // Furniture & Home
  { 
    name: "home", 
    component: Home, 
    label: "Home Items", 
    category: "Home & Furniture", 
    keywords: ["house", "residence", "home goods", "decor"],
    commonUse: ["home decor", "household items", "home accessories", "decorative items"]
  },
  { 
    name: "sofa", 
    component: Sofa, 
    label: "Furniture", 
    category: "Home & Furniture", 
    keywords: ["couch", "seating", "living room", "upholstery"],
    commonUse: ["sofa", "couch", "sectional", "loveseat", "recliner"]
  },

  // Clothing & Fashion
  { 
    name: "shirt", 
    component: Shirt, 
    label: "Clothing", 
    category: "Clothing & Fashion", 
    keywords: ["clothes", "apparel", "wear", "fashion"],
    commonUse: ["shirts", "clothing", "apparel", "garments", "fashion items"]
  },
  { 
    name: "shoppingbag", 
    component: ShoppingBag, 
    label: "Bags & Accessories", 
    category: "Clothing & Fashion", 
    keywords: ["bag", "purse", "handbag", "accessories"],
    commonUse: ["handbags", "purses", "backpacks", "luggage", "accessories"]
  },

  // Kitchen & Dining
  { 
    name: "utensils", 
    component: Utensils, 
    label: "Kitchen Items", 
    category: "Kitchen & Dining", 
    keywords: ["cooking", "cutlery", "dining", "kitchen"],
    commonUse: ["kitchen utensils", "cookware", "cutlery", "kitchen tools"]
  },
  { 
    name: "coffee", 
    component: Coffee, 
    label: "Beverages", 
    category: "Kitchen & Dining", 
    keywords: ["drink", "beverage", "coffee", "tea"],
    commonUse: ["coffee maker", "beverages", "drink supplies", "coffee equipment"]
  },

  // Tools & Hardware
  { 
    name: "wrench", 
    component: Wrench, 
    label: "Tools", 
    category: "Tools & Hardware", 
    keywords: ["repair", "fix", "maintenance", "hardware"],
    commonUse: ["hand tools", "repair tools", "maintenance equipment", "hardware"]
  },

  // Sports & Recreation
  { 
    name: "gamepad", 
    component: Gamepad2, 
    label: "Gaming", 
    category: "Sports & Recreation", 
    keywords: ["controller", "video games", "console", "gaming"],
    commonUse: ["game controllers", "gaming accessories", "video games", "console games"]
  },
  { 
    name: "dumbbell", 
    component: Dumbbell, 
    label: "Fitness", 
    category: "Sports & Recreation", 
    keywords: ["exercise", "workout", "gym", "fitness"],
    commonUse: ["fitness equipment", "exercise gear", "gym equipment", "workout tools"]
  },
  { 
    name: "bike", 
    component: Bike, 
    label: "Sports Equipment", 
    category: "Sports & Recreation", 
    keywords: ["bicycle", "cycling", "exercise", "outdoor"],
    commonUse: ["bicycles", "sports equipment", "outdoor gear", "exercise equipment"]
  },

  // Books & Education
  { 
    name: "book", 
    component: Book, 
    label: "Books", 
    category: "Books & Education", 
    keywords: ["reading", "literature", "study", "education"],
    commonUse: ["books", "textbooks", "novels", "educational materials"]
  },
  { 
    name: "calculator", 
    component: Calculator, 
    label: "Office Supplies", 
    category: "Books & Education", 
    keywords: ["math", "numbers", "office", "supplies"],
    commonUse: ["calculators", "office supplies", "stationery", "school supplies"]
  },

  // Media & Entertainment
  { 
    name: "film", 
    component: Film, 
    label: "Media", 
    category: "Media & Entertainment", 
    keywords: ["movie", "cinema", "video", "entertainment"],
    commonUse: ["movies", "DVDs", "media collection", "entertainment items"]
  },
  { 
    name: "music", 
    component: Music, 
    label: "Music", 
    category: "Media & Entertainment", 
    keywords: ["audio", "sound", "instrument", "records"],
    commonUse: ["music instruments", "audio equipment", "records", "CDs"]
  },

  // Baby & Kids
  { 
    name: "baby", 
    component: Baby, 
    label: "Baby Items", 
    category: "Baby & Kids", 
    keywords: ["infant", "child", "kids", "toys"],
    commonUse: ["baby supplies", "children's items", "toys", "kids' clothing"]
  },

  // Travel & Transportation
  { 
    name: "plane", 
    component: Plane, 
    label: "Travel", 
    category: "Travel & Transportation", 
    keywords: ["airplane", "flight", "vacation", "travel"],
    commonUse: ["travel gear", "luggage", "travel accessories", "vacation items"]
  },
  { 
    name: "car", 
    component: Car, 
    label: "Automotive", 
    category: "Travel & Transportation", 
    keywords: ["vehicle", "automobile", "drive", "auto"],
    commonUse: ["car accessories", "automotive parts", "vehicle supplies", "car care"]
  },
  { 
    name: "tent", 
    component: Tent, 
    label: "Outdoor Gear", 
    category: "Travel & Transportation", 
    keywords: ["camping", "hiking", "adventure", "outdoor"],
    commonUse: ["camping gear", "outdoor equipment", "hiking supplies", "adventure gear"]
  },

  // Pets
  { 
    name: "pawprint", 
    component: PawPrint, 
    label: "Pet Supplies", 
    category: "Pets", 
    keywords: ["dog", "cat", "animal", "pet"],
    commonUse: ["pet supplies", "dog accessories", "cat items", "pet food", "pet toys"]
  },

  // Storage & Organization
  { 
    name: "box", 
    component: Box, 
    label: "Storage", 
    category: "Storage & Organization", 
    keywords: ["container", "package", "storage", "organize"],
    commonUse: ["storage boxes", "containers", "organizing supplies", "packaging"]
  },
  { 
    name: "package", 
    component: Package, 
    label: "Packages", 
    category: "Storage & Organization", 
    keywords: ["delivery", "shipping", "box", "mail"],
    commonUse: ["packages", "deliveries", "shipped items", "mail"]
  },
  { 
    name: "archive", 
    component: Archive, 
    label: "Documents", 
    category: "Storage & Organization", 
    keywords: ["store", "save", "organize", "files"],
    commonUse: ["documents", "files", "paperwork", "records"]
  },

  // Office & Work
  { 
    name: "briefcase", 
    component: Briefcase, 
    label: "Office", 
    category: "Office & Work", 
    keywords: ["business", "work", "professional", "office"],
    commonUse: ["office equipment", "business supplies", "work items", "professional gear"]
  },

  // General Items
  { 
    name: "gift", 
    component: Gift, 
    label: "Gifts", 
    category: "General", 
    keywords: ["present", "surprise", "celebration", "special"],
    commonUse: ["gifts", "presents", "special items", "collectibles"]
  },
  { 
    name: "heart", 
    component: Heart, 
    label: "Personal", 
    category: "General", 
    keywords: ["love", "favorite", "personal", "sentimental"],
    commonUse: ["personal items", "sentimental objects", "keepsakes", "mementos"]
  },
  { 
    name: "tag", 
    component: Tag, 
    label: "Miscellaneous", 
    category: "General", 
    keywords: ["label", "category", "other", "misc"],
    commonUse: ["miscellaneous items", "uncategorized", "random objects", "other"]
  }
];

export const getIconByName = (name: string | undefined | null): LucideIcon | null => {
  if (!name) return null;
  
  const iconOption = inventoryIcons.find(icon => icon.name === name);
  return iconOption ? iconOption.component : null;
};

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = Array.from(new Set(inventoryIcons.map(icon => icon.category)));
  return categories.sort();
};

// Search icons by query (name, label, keywords, category, commonUse)
export const searchInventoryIcons = (query: string): IconOption[] => {
  if (!query.trim()) return inventoryIcons;
  
  const searchTerm = query.toLowerCase().trim();
  
  return inventoryIcons.filter(icon => {
    const nameMatch = icon.name.toLowerCase().includes(searchTerm);
    const labelMatch = icon.label.toLowerCase().includes(searchTerm);
    const categoryMatch = icon.category.toLowerCase().includes(searchTerm);
    const keywordMatch = icon.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm)
    );
    const commonUseMatch = icon.commonUse.some(use => 
      use.toLowerCase().includes(searchTerm)
    );
    
    return nameMatch || labelMatch || categoryMatch || keywordMatch || commonUseMatch;
  });
};

// Filter icons by category
export const filterInventoryIconsByCategory = (category: string): IconOption[] => {
  if (!category || category === 'All') return inventoryIcons;
  return inventoryIcons.filter(icon => icon.category === category);
};

// Search and filter icons
export const searchAndFilterIcons = (query: string, category: string): IconOption[] => {
  let filteredIcons = inventoryIcons;
  
  // First filter by category if specified
  if (category && category !== 'All') {
    filteredIcons = filterInventoryIconsByCategory(category);
  }
  
  // Then search within the filtered results
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    filteredIcons = filteredIcons.filter(icon => {
      const nameMatch = icon.name.toLowerCase().includes(searchTerm);
      const labelMatch = icon.label.toLowerCase().includes(searchTerm);
      const categoryMatch = icon.category.toLowerCase().includes(searchTerm);
      const keywordMatch = icon.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      const commonUseMatch = icon.commonUse.some(use => 
        use.toLowerCase().includes(searchTerm)
      );
      
      return nameMatch || labelMatch || categoryMatch || keywordMatch || commonUseMatch;
    });
  }
  
  return filteredIcons;
};

// Function to generate a consistent color based on item category
export const getColorForInventoryCategory = (category: string): string => {
  const categoryColors: Record<string, string> = {
    "Electronics": "bg-blue-200",
    "Home & Furniture": "bg-green-200",
    "Clothing & Fashion": "bg-pink-200",
    "Kitchen & Dining": "bg-orange-200",
    "Tools & Hardware": "bg-gray-200",
    "Sports & Recreation": "bg-red-200",
    "Books & Education": "bg-purple-200",
    "Media & Entertainment": "bg-indigo-200",
    "Baby & Kids": "bg-yellow-200",
    "Travel & Transportation": "bg-teal-200",
    "Pets": "bg-amber-200",
    "Storage & Organization": "bg-slate-200",
    "Office & Work": "bg-cyan-200",
    "General": "bg-neutral-200"
  };
  
  return categoryColors[category] || "bg-gray-200";
};

// Function to get an icon based on a tag or item description
export const getInventoryIconForItem = (itemDescription: string): string | null => {
  const itemToIconMap: Record<string, string> = {
    // Electronics
    "laptop": "laptop",
    "computer": "laptop",
    "macbook": "laptop",
    "notebook": "laptop",
    "monitor": "monitor",
    "display": "monitor",
    "screen": "monitor",
    "phone": "smartphone",
    "mobile": "smartphone",
    "iphone": "smartphone",
    "android": "smartphone",
    "smartphone": "smartphone",
    "television": "tv",
    "tv": "tv",
    "smart tv": "tv",
    "watch": "watch",
    "smartwatch": "watch",
    "apple watch": "watch",
    "camera": "camera",
    "dslr": "camera",
    "webcam": "camera",
    "headphones": "headphones",
    "earbuds": "headphones",
    "headset": "headphones",
    "electronics": "cpu",
    "gadget": "cpu",
    "electronic": "cpu",
    
    // Home & Furniture
    "furniture": "sofa",
    "sofa": "sofa",
    "couch": "sofa",
    "chair": "sofa",
    "table": "sofa",
    "home": "home",
    "decor": "home",
    "household": "home",
    
    // Clothing
    "clothing": "shirt",
    "clothes": "shirt",
    "shirt": "shirt",
    "apparel": "shirt",
    "bag": "shoppingbag",
    "purse": "shoppingbag",
    "handbag": "shoppingbag",
    "backpack": "shoppingbag",
    
    // Kitchen
    "kitchen": "utensils",
    "cooking": "utensils",
    "cookware": "utensils",
    "utensils": "utensils",
    "coffee": "coffee",
    "beverage": "coffee",
    "drink": "coffee",
    
    // Tools
    "tools": "wrench",
    "tool": "wrench",
    "hardware": "wrench",
    "repair": "wrench",
    
    // Sports & Recreation
    "gaming": "gamepad",
    "game": "gamepad",
    "controller": "gamepad",
    "console": "gamepad",
    "fitness": "dumbbell",
    "exercise": "dumbbell",
    "gym": "dumbbell",
    "workout": "dumbbell",
    "sports": "bike",
    "bicycle": "bike",
    "bike": "bike",
    
    // Books & Education
    "book": "book",
    "books": "book",
    "textbook": "book",
    "novel": "book",
    "office supplies": "calculator",
    "stationery": "calculator",
    "supplies": "calculator",
    
    // Media
    "movie": "film",
    "dvd": "film",
    "film": "film",
    "media": "film",
    "music": "music",
    "instrument": "music",
    "audio": "music",
    
    // Baby & Kids
    "baby": "baby",
    "kids": "baby",
    "children": "baby",
    "toys": "baby",
    
    // Travel
    "travel": "plane",
    "luggage": "plane",
    "vacation": "plane",
    "car": "car",
    "automotive": "car",
    "vehicle": "car",
    "camping": "tent",
    "outdoor": "tent",
    "hiking": "tent",
    
    // Pets
    "pet": "pawprint",
    "dog": "pawprint",
    "cat": "pawprint",
    "animal": "pawprint",
    
    // Storage
    "box": "box",
    "storage": "box",
    "container": "box",
    "package": "package",
    "shipping": "package",
    "delivery": "package",
    "documents": "archive",
    "files": "archive",
    "paperwork": "archive",
    
    // Office
    "office": "briefcase",
    "business": "briefcase",
    "work": "briefcase",
    
    // General
    "gift": "gift",
    "present": "gift",
    "personal": "heart",
    "sentimental": "heart",
    "misc": "tag",
    "miscellaneous": "tag",
    "other": "tag"
  };

  if (!itemDescription) return null;
  
  const normalizedDescription = itemDescription.toLowerCase().trim();
  
  // Try exact match first
  if (itemToIconMap[normalizedDescription]) {
    return itemToIconMap[normalizedDescription];
  }
  
  // Try partial matches
  for (const [key, icon] of Object.entries(itemToIconMap)) {
    if (normalizedDescription.includes(key) || key.includes(normalizedDescription)) {
      return icon;
    }
  }
  
  return null;
};

// Export the refined icon list as default
export const availableIcons = inventoryIcons;
export default inventoryIcons;