
import { useState } from "react";
import { Item } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Image, X } from "lucide-react";

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Omit<Item, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
}

const ItemForm = ({ 
  initialData = {
    name: "",
    description: "",
    imageUrl: "",
    quantity: 1,
    location: "",
    tags: []
  }, 
  onSubmit, 
  onCancel,
  submitLabel 
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<Item, "id">>(initialData as Omit<Item, "id">);
  const [tagInput, setTagInput] = useState("");
  
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
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
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
    onSubmit(formData);
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
          <Image className="mx-auto text-gray-400" size={48} />
          <p className="mt-2 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF up to 5MB
          </p>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-4"
            onClick={() => setFormData(prev => ({ 
              ...prev, 
              imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png" 
            }))}
          >
            Simulate Upload
          </Button>
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
          <option value="Kitchen">Kitchen</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Wardrobe">Wardrobe</option>
          <option value="Drawer">Drawer</option>
          <option value="Garage">Garage</option>
          <option value="Attic">Attic</option>
          <option value="Basement">Basement</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex mb-2">
          <Input
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
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
