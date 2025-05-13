
import { Item } from "@/types";
import { getIconForTag } from "@/utils/iconUtils";

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
  pet: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
  music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  gaming: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
  travel: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
  fitness: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
  baby: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
  office: "https://images.unsplash.com/photo-1497215842964-222b430dc094"
};

/**
 * Gets a default image based on the item's tags or name
 * @param item The item to find a default image for
 * @returns URL of the default image
 */
export const getDefaultImage = (item: Item | Partial<Item>): string => {
  // If the item has an imageUrl, return it
  if (item.imageUrl) return item.imageUrl;
  
  // Check if we can suggest an icon based on the first tag
  if (item.tags && item.tags.length > 0) {
    // First check if there's a tag-based icon for this item
    const firstTag = item.tags[0];
    const iconName = getIconForTag(firstTag);
    
    // If we found an icon for the tag, we'll return null because
    // this will make the component use the icon instead of an image
    if (iconName) {
      // We return an empty string to indicate we should use an icon
      // The component that uses this will check both imageUrl and iconType
      return "";
    }
    
    // If no icon found, try to match with category images
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

