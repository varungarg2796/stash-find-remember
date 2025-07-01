import { Tag, X } from "lucide-react";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  isEditing?: boolean;
}

const TagSelector = ({ selectedTags, onChange, isEditing = false }: TagSelectorProps) => {
  const { user } = useAuth();
  
  // The user object now directly contains the tags array.
  const commonTags = user?.tags || [];
  
  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(t => t !== tagToRemove));
  };
  
  return (
    <div>
      <div className="flex items-center mb-1">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
      </div>
      
      <div className="mb-3">
        <Select onValueChange={handleTagSelect} value="">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tags to add..." />
          </SelectTrigger>
          <SelectContent>
            {commonTags.map(tag => (
              <SelectItem 
                key={tag.id} 
                value={tag.name}
                disabled={selectedTags.includes(tag.name)}
              >
                <div className="flex items-center">
                  <Tag size={14} className="mr-2" />
                  {tag.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.length > 0 ? selectedTags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm"
          >
            <span>{tag}</span>
            <button 
              type="button" 
              onClick={() => handleRemoveTag(tag)}
              className="ml-1.5 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No tags added yet.</p>
        )}
      </div>
    </div>
  );
};

export default TagSelector;