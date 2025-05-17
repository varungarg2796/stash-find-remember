import { useState, useEffect } from "react";
import { Item } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getDefaultImage } from "@/utils/imageUtils";
import ImageUploader from "./form/ImageUploader";
import IconSelector from "./form/IconSelector";
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
import { getIconForTag } from "@/utils/iconUtils";

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Omit<Item, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
  isEditing?: boolean;
}

// Define default initial data outside the component for a stable reference
const defaultInitialItemData: Omit<Item, "id"> = {
  name: "",
  description: "",
  imageUrl: "",
  iconType: null,
  quantity: 1,
  location: "",
  tags: [],
  price: undefined,
  priceless: false,
  acquisitionDate: undefined,
  createdAt: new Date()
};

const getPlaceholderImage = (name: string = ""): string => {
  // Corrected placeholder image path if needed, or ensure it exists.
  // Assuming you meant wine-glasses.jpg based on your public folder.
  return "/lovable-uploads/wine-glasses.jpg";
};

const ItemForm = ({
  initialData: initialDataProp = defaultInitialItemData, // Use the stable default
  onSubmit,
  onCancel,
  submitLabel,
  isEditing = false
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<Item, "id">>({ ...defaultInitialItemData, ...initialDataProp });
  const [useIcon, setUseIcon] = useState<boolean>(!!initialDataProp.iconType);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to reset the form if initialDataProp changes (e.g., for editing a different item)
  useEffect(() => {
    setFormData({ ...defaultInitialItemData, ...initialDataProp });
    setUseIcon(!!initialDataProp.iconType); // Also reset useIcon based on the new initial data
  }, [initialDataProp]); // Dependency only on the prop itself

  // Effect to handle UI changes when toggling between icon and image
  useEffect(() => {
    setFormData(prev => {
      if (useIcon) {
        // When switching to icon mode, clear imageUrl. Icon value is handled by IconSelector.
        return { ...prev, imageUrl: "" };
      } else {
        // When switching to image mode, clear iconType. Image value is handled by ImageUploader.
        return { ...prev, iconType: null };
      }
    });
  }, [useIcon]); // Only depends on useIcon

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setFormData(prev => ({
      ...prev,
      imageUrl,
    }));
  };

  const handleIconChange = (iconType: string | null) => {
    setFormData(prev => ({
      ...prev,
      iconType,
    }));
  };

  const handleImageMethodToggle = (useIconValue: boolean) => {
    setUseIcon(useIconValue);
    // The actual formData update for imageUrl/iconType will happen in the useEffect listening to useIcon
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, acquisitionDate: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateItemForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      toast.error("Please fix the errors in the form");
      return;
    }

    let finalData = { ...formData };

    if (useIcon && !finalData.iconType && finalData.tags && finalData.tags.length > 0) {
      for (const tag of finalData.tags) {
        const suggestedIcon = getIconForTag(tag);
        if (suggestedIcon) {
          finalData.iconType = suggestedIcon;
          break;
        }
      }
    }

    finalData = {
      ...finalData,
      imageUrl: useIcon ? "" : (!finalData.imageUrl ? getDefaultImage(finalData) : finalData.imageUrl),
      iconType: useIcon ? finalData.iconType : null
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

      <div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Visual
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!useIcon ? "default" : "outline"}
              onClick={() => handleImageMethodToggle(false)}
              className="flex-1"
            >
              Upload Image
            </Button>
            <Button
              type="button"
              variant={useIcon ? "default" : "outline"}
              onClick={() => handleImageMethodToggle(true)}
              className="flex-1"
            >
              Use Icon
            </Button>
          </div>
        </div>

        {useIcon ? (
          <IconSelector
            selectedIcon={formData.iconType || null}
            onSelectIcon={handleIconChange}
          />
        ) : (
          <ImageUploader
            imageUrl={formData.imageUrl}
            onImageChange={handleImageChange}
            getPlaceholderImage={getPlaceholderImage}
            itemName={formData.name}
          />
        )}
      </div>

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