import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to generate consistent colors for tags
export function getTagColor(tag: string): string {
  // Generate color based on the tag string to ensure consistency
  const colors = [
    "#ecd9ff", // Light purple
    "#d9f2ff", // Light blue
    "#d9ffea", // Light mint
    "#fff3d9", // Light orange
    "#ffd9d9", // Light red
    "#f2d9ff", // Light magenta
    "#d9ffff", // Light cyan
    "#e6ffd9"  // Light green
  ];
  
  // Use a simple hash function to determine the color index
  let hashCode = 0;
  for (let i = 0; i < tag.length; i++) {
    hashCode = ((hashCode << 5) - hashCode) + tag.charCodeAt(i);
    hashCode = hashCode & hashCode; // Convert to 32bit integer
  }
  
  // Get positive value and find index
  const index = Math.abs(hashCode) % colors.length;
  
  return colors[index];
}
