import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to extract error messages from nested API error structures
export function getErrorMessage(error: any, fallback: string = 'An error occurred'): string {
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // Check error.message first (for Error objects)
  if (error.message) {
    if (typeof error.message === 'string') {
      return error.message;
    }
    // Handle nested message structure like { message: { message: "actual message" } }
    if (typeof error.message === 'object' && error.message.message) {
      return error.message.message;
    }
  }

  // Check error.response.data structure (for API errors)
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data.message === 'string') {
      return data.message;
    }
    if (typeof data.message === 'object' && data.message?.message) {
      return data.message.message;
    }
    if (data.error) {
      return data.error;
    }
  }

  // Check error.response?.data?.message directly
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message === 'object' && message.message) {
      return message.message;
    }
  }

  // Check for error property
  if (error.error) {
    return error.error;
  }

  return fallback;
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
