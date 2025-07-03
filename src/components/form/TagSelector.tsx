import { Tag, X, Plus } from "lucide-react";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { userApi } from "@/services/api/userApi";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  isEditing?: boolean;
}

const TagSelector = ({ selectedTags, onChange, isEditing = false }: TagSelectorProps) => {
  const { user, updateUserInContext } = useAuth();
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  // The user object now directly contains the tags array.
  const commonTags = user?.tags || [];
  
  const handleAddNewTag = async () => {
    if (newTagName.trim()) {
      const trimmedTag = newTagName.trim();
      
      // Check if tag already exists in common tags or selected tags
      const existsInCommon = commonTags.some(tag => tag.name.toLowerCase() === trimmedTag.toLowerCase());
      const existsInSelected = selectedTags.some(tag => tag.toLowerCase() === trimmedTag.toLowerCase());
      
      if (existsInCommon || existsInSelected) {
        toast.error('Tag already exists');
        return;
      }
      
      try {
        // Create new tag object
        const newTag = {
          id: Date.now().toString(), // Temporary ID
          name: trimmedTag
        };
        
        // Update the user's tags array
        const updatedTags = [...commonTags, newTag];
        const tagNames = updatedTags.map(tag => tag.name);
        
        // Save to backend using updatePreferences
        const updatedUser = await userApi.updatePreferences({ tags: tagNames });
        
        // Update user context with new data
        updateUserInContext(updatedUser);
        
        // Add to selected tags
        onChange([...selectedTags, trimmedTag]);
        setNewTagName('');
        setShowNewTagForm(false);
        toast.success(`Added new tag: "${trimmedTag}"`);
      } catch (error) {
        toast.error('Failed to add tag. Please try again.');
        console.error('Error adding tag:', error);
      }
    }
  };
  
  const handleCancelNewTag = () => {
    setNewTagName('');
    setShowNewTagForm(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNewTag();
    } else if (e.key === 'Escape') {
      handleCancelNewTag();
    }
  };
  
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
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Tags
          </label>
          <p className="text-xs text-gray-500 mt-1">Organize and search easily</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Tag input section */}
        {!showNewTagForm ? (
          <div className="flex gap-2">
            <Select onValueChange={handleTagSelect} value="">
              <SelectTrigger className="flex-1 h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="Choose existing tags..." />
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
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewTagForm(true)}
              className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
              title="Add new tag"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter new tag name"
              className="flex-1 h-12 sm:h-10 text-base sm:text-sm"
              autoFocus
            />
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleAddNewTag}
              disabled={!newTagName.trim()}
              className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelNewTag}
              className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Quick tag suggestions */}
        {commonTags.length === 0 && !showNewTagForm && selectedTags.length === 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="mb-2">💡 <strong>Quick start:</strong> Add common tags</p>
            <div className="flex gap-2 flex-wrap">
              {['Electronics', 'Clothing', 'Books', 'Kitchen', 'Tools', 'Documents'].map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange([...selectedTags, suggestion])}
                  className="text-xs h-6 px-2 border border-gray-200 hover:bg-gray-100"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <div 
                key={index} 
                className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 flex items-center text-sm gap-1.5"
              >
                <Tag size={12} className="text-blue-600" />
                <span className="text-blue-800">{tag}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                  title="Remove tag"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;