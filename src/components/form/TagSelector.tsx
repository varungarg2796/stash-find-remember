
import { useState } from "react";
import { Tag, X, Info } from "lucide-react";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  isEditing?: boolean;
}

const DEFAULT_TAGS = [
  "Electronics", "Clothing", "Books", "Kitchen", "Furniture",
  "Tools", "Decor", "Sports", "Beauty", "Toys"
];

const TagSelector = ({ selectedTags, onChange, isEditing = false }: TagSelectorProps) => {
  const { user } = useAuth();
  
  // Common tags from user preferences with fallback to defaults
  const commonTags = (user?.preferences?.tags || DEFAULT_TAGS).filter(tag => tag && tag.trim() !== "");
  
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };
  
  return (
    <div>
      <div className="flex items-center mb-1">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        
        {isEditing && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2">
                  <Info size={14} className="text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px]">
                  You can configure common tags in your profile settings.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="mb-3">
        <Select onValueChange={handleTagSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            {commonTags.map(tag => (
              <SelectItem 
                key={tag} 
                value={tag}
                disabled={selectedTags.includes(tag)}
              >
                <div className="flex items-center">
                  <Tag size={14} className="mr-2" />
                  {tag}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
          >
            <span className="text-sm">{tag}</span>
            <button 
              type="button" 
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {selectedTags.length === 0 && (
          <p className="text-sm text-gray-500">No tags added yet</p>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
