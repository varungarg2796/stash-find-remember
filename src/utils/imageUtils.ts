
import { Item } from "@/types";

// Mapping of item categories (based on tags) to default images
const categoryImageMap: Record<string, string> = {
  clothing: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  book: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  electronics: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  furniture: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  kitchen: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  decor: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  toy: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  tool: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  sport: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  outdoor: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  cosmetic: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  food: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  pet: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
};

/**
 * Gets a default image based on the item's tags or name
 * @param item The item to find a default image for
 * @returns URL of the default image
 */
export const getDefaultImage = (item: Item | Partial<Item>): string => {
  // If the item has an imageUrl, return it
  if (item.imageUrl) return item.imageUrl;
  
  // Try to find a matching category based on tags
  if (item.tags && item.tags.length > 0) {
    for (const tag of item.tags) {
      const normalizedTag = tag.toLowerCase();
      
      // Check for direct matches with our category map
      if (categoryImageMap[normalizedTag]) {
        return categoryImageMap[normalizedTag];
      }
      
      // Check for partial matches (e.g. "t-shirt" matches "clothing")
      for (const category of Object.keys(categoryImageMap)) {
        if (
          normalizedTag.includes(category) || 
          category.includes(normalizedTag)
        ) {
          return categoryImageMap[category];
        }
      }
    }
  }
  
  // If no matches from tags, try to infer from name (if available)
  if (item.name) {
    const normalizedName = item.name.toLowerCase();
    for (const category of Object.keys(categoryImageMap)) {
      if (
        normalizedName.includes(category) || 
        category.includes(normalizedName)
      ) {
        return categoryImageMap[category];
      }
    }
  }
  
  // If no matches, use a generic placeholder
  return "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png";
};
