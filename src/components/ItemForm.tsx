
import { useState } from "react";
import { Item } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getDefaultImage } from "@/utils/imageUtils";
import ImageUploader from "./form/ImageUploader";
import QuantityInput from "./form/QuantityInput";
import LocationSelector from "./form/LocationSelector";
import PriceInput from "./form/PriceInput";
import TagSelector from "./form/TagSelector";

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Omit<Item, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
  isEditing?: boolean;
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
  submitLabel,
  isEditing = false
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<Item, "id">>(initialData as Omit<Item, "id">);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuantityChange = (quantity: number) => {
    setFormData(prev => ({ ...prev, quantity }));
  };
  
  const handleLocationChange = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
  };
  
  const handlePricelessToggle = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      priceless: checked,
      price: checked ? undefined : prev.price 
    }));
  };
  
  const handlePriceChange = (value: number | undefined) => {
    setFormData(prev => ({ ...prev, price: value }));
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };
  
  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
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
      
      <ImageUploader
        imageUrl={formData.imageUrl}
        onImageChange={handleImageChange}
        getPlaceholderImage={getPlaceholderImage}
        itemName={formData.name}
      />
      
      <QuantityInput 
        quantity={formData.quantity}
        onChange={handleQuantityChange}
      />
      
      <LocationSelector
        value={formData.location}
        onChange={handleLocationChange}
        isEditing={isEditing}
      />
      
      <PriceInput
        price={formData.price}
        priceless={!!formData.priceless}
        onPriceChange={handlePriceChange}
        onPricelessToggle={handlePricelessToggle}
      />
      
      <TagSelector
        selectedTags={formData.tags}
        onChange={handleTagsChange}
        isEditing={isEditing}
      />
      
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
