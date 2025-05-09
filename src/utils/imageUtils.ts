
import { Item } from "@/types";

// Mapping of item categories (based on tags) to default images
const categoryImageMap: Record<string, string> = {
  clothing: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  book: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  electronics: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  kitchen: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d",
  decor: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
  toy: "https://images.unsplash.com/photo-1558060370-d5019f566210",
  tool: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f",
  sport: "https://images.unsplash.com/photo-1562771242-a02d9090c90c",
  outdoor: "https://images.unsplash.com/photo-1575438922952-8ebd22b0bc1f",
  cosmetic: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  food: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
  pet: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
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
  return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
};
