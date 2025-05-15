
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tag color options for consistent styling across the app
export const getTagColorClasses = (tag: string) => {
  // Create a simple hash from the tag string
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Color combinations (background + text)
  const colorOptions = [
    'bg-indigo-50 text-indigo-700',    // Purple/Indigo
    'bg-blue-50 text-blue-700',        // Blue
    'bg-teal-50 text-teal-700',        // Teal
    'bg-amber-50 text-amber-700',      // Amber
    'bg-rose-50 text-rose-700',        // Rose
    'bg-emerald-50 text-emerald-700',  // Emerald
    'bg-cyan-50 text-cyan-700',        // Cyan
    'bg-fuchsia-50 text-fuchsia-700',  // Fuchsia
  ];
  
  // Return a color based on the hash
  return colorOptions[hash % colorOptions.length];
};
