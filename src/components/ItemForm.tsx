
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { validateItemForm } from "@/utils/validationUtils";
import { toast } from "sonner";

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Omit<Item, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
  isEditing?: boolean;
}

const getPlaceholderImage = (name: string = ""): string => {
  const placeholders = [
    "/lovable-uploads/wine-glasses.png",
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
    priceless: false,
    acquisitionDate: undefined
  }, 
  onSubmit, 
  onCancel,
  submitLabel,
  isEditing = false
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<Item, "id">>(initialData as Omit<Item, "id">);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleQuantityChange = (quantity: number) => {
    setFormData(prev => ({ ...prev, quantity }));
    if (errors.quantity) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.quantity;
        return newErrors;
      });
    }
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
    if (errors.price) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };
  
  const handlePriceChange = (value: number | undefined) => {
    setFormData(prev => ({ ...prev, price: value }));
    if (errors.price) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
    if (errors.tags) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.tags;
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, acquisitionDate: date }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    const validation = validateItemForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      toast.error("Please fix the errors in the form");
      return;
    }
    
    const finalData = {
      ...formData,
      imageUrl: formData.imageUrl || getDefaultImage(formData)
    };
    
    onSubmit(finalData);
    setIsSubmitting(false);
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
          className={errors.name ? "border-destructive" : ""}
          required
        />
        {errors.name && (
          <div className="text-destructive text-xs flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.name}
          </div>
        )}
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
          className={errors.description ? "border-destructive" : ""}
          rows={4}
        />
        {errors.description && (
          <div className="text-destructive text-xs flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.description}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {formData.description?.length || 0}/500
        </div>
      </div>
      
      <ImageUploader
        imageUrl={formData.imageUrl}
        onImageChange={handleImageChange}
        getPlaceholderImage={getPlaceholderImage}
        itemName={formData.name}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Acquisition Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.acquisitionDate && "text-muted-foreground"
              )}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.acquisitionDate ? format(formData.acquisitionDate, "PPP") : <span>When did you get this item?</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.acquisitionDate}
              onSelect={handleDateChange}
              disabled={(date) => date > new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <QuantityInput 
        quantity={formData.quantity}
        onChange={handleQuantityChange}
      />
      {errors.quantity && (
        <div className="text-destructive text-xs flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errors.quantity}
        </div>
      )}
      
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
      {errors.price && (
        <div className="text-destructive text-xs flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errors.price}
        </div>
      )}
      
      <TagSelector
        selectedTags={formData.tags}
        onChange={handleTagsChange}
        isEditing={isEditing}
      />
      {errors.tags && (
        <div className="text-destructive text-xs flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errors.tags}
        </div>
      )}
      
      <div className="flex space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
