import { useState } from "react";
import { Item } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Image, X, Heart, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getDefaultImage } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Omit<Item, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
}

const getPlaceholderImage = (name: string = ""): string => {
  const placeholders = [
    "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
  ];
  
  return placeholders[0];
};

const ItemForm = ({ 
  initialData = {
    name: "",
    description: "",
    imageUrl: "",
    quantity: 1,
    location: "",
    tags: [],
    price: undefined,
    priceless: false
  }, 
  onSubmit, 
  onCancel,
  submitLabel 
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<Item, "id">>(initialData as Omit<Item, "id">);
  const [tagInput, setTagInput] = useState("");
  const { user } = useAuth();
  
  // Common tags from user preferences or default ones
  const commonTags = user?.preferences?.tags || [
    "Clothing", "Book", "Electronics", "Furniture", "Kitchen",
    "Decor", "Toy", "Tool", "Sport", "Outdoor", "Cosmetic", "Food", "Pet"
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuantityChange = (amount: number) => {
    setFormData(prev => ({ 
      ...prev, 
      quantity: Math.max(1, (prev.quantity || 1) + amount) 
    }));
  };
  
  const handlePricelessToggle = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      priceless: checked,
      price: checked ? undefined : prev.price 
    }));
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setFormData(prev => ({ ...prev, price: value }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };
  
  const handleTagSelect = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalData = {
      ...formData,
      imageUrl: formData.imageUrl || getDefaultImage(formData)
    };
    
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name*
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter item name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter item description"
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {formData.imageUrl ? (
            <div className="relative w-32 h-32 mx-auto">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X size={14} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <>
              <Image className="mx-auto text-gray-400" size={48} />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </>
          )}
          
          {!formData.imageUrl && (
            <Button 
              type="button" 
              variant="outline" 
              className="mt-4"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                imageUrl: getPlaceholderImage(prev.name)
              }))}
            >
              Simulate Upload
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <div className="flex items-center">
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={formData.quantity <= 1}
          >
            <Minus size={18} />
          </Button>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className="mx-2 text-center"
          />
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a location</option>
          {user?.preferences?.locations?.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          )) || [
            <option key="kitchen" value="Kitchen">Kitchen</option>,
            <option key="bedroom" value="Bedroom">Bedroom</option>,
            <option key="wardrobe" value="Wardrobe">Wardrobe</option>,
            <option key="drawer" value="Drawer">Drawer</option>,
            <option key="garage" value="Garage">Garage</option>,
            <option key="attic" value="Attic">Attic</option>,
            <option key="basement" value="Basement">Basement</option>,
            <option key="other" value="Other">Other</option>
          ]}
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart size={18} className="text-pink-500" />
            <Label htmlFor="priceless" className="font-medium text-gray-700">
              Priceless (Sentimental Value)
            </Label>
          </div>
          <Switch 
            id="priceless" 
            checked={!!formData.priceless}
            onCheckedChange={handlePricelessToggle}
          />
        </div>
        
        {!formData.priceless && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (optional)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ""}
              onChange={handlePriceChange}
              placeholder="Enter item value"
            />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        
        {/* Common tag selection */}
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
                  disabled={formData.tags.includes(tag)}
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
        
        {/* Custom tag input */}
        <div className="flex mb-2">
          <Input
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a custom tag"
            className="mr-2"
          />
          <Button 
            type="button" 
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
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
          {formData.tags.length === 0 && (
            <p className="text-sm text-gray-500">No tags added yet</p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
