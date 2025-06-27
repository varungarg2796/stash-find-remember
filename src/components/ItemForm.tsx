import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ImageUploader from './form/ImageUploader';
import IconSelector from './form/IconSelector';
import QuantityInput from './form/QuantityInput';
import LocationSelector from './form/LocationSelector';
import PriceInput from './form/PriceInput';
import TagSelector from './form/TagSelector';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ItemFormProps {
  initialData?: Partial<Item>;
  // The onSubmit now passes the raw File object separately
  onSubmit: (data: Omit<Item, 'id' | 'createdAt'>, imageFile?: File) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

const ItemForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel,
  isEditing = false,
  isSubmitting = false
}: ItemFormProps) => {
  const [formData, setFormData] = useState<Partial<Omit<Item, 'id'>>>({
    name: '',
    description: '',
    quantity: 1,
    location: '',
    tags: [],
    price: undefined,
    priceless: false,
    ...initialData
  });

  const [useIcon, setUseIcon] = useState<boolean>(!!initialData?.iconType);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(initialData.imageUrl || '');
  
  // Clean up the temporary object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({...prev, imageUrl: ''})); // Clear existing imageUrl
    } else {
      setImageFile(undefined);
      setImagePreviewUrl('');
    }
  };

  const handleImageMethodToggle = (useIconValue: boolean) => {
    setUseIcon(useIconValue);
    // Clear the other method's data
    if (useIconValue) {
      setImageFile(undefined);
      setImagePreviewUrl('');
    } else {
      setFormData(prev => ({ ...prev, iconType: undefined }));
    }
  };
  
  const handleIconChange = (iconType: string | null) => {
    setFormData(prev => ({ ...prev, iconType: iconType || undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Item name is required.");
      return;
    }
    // The parent component (`AddItem.tsx`) now handles the submission logic
    onSubmit(formData as Omit<Item, 'id'|'createdAt'>, imageFile);
  };
  
  // --- Other Handlers ---
  const handleQuantityChange = (quantity: number) => setFormData(prev => ({ ...prev, quantity }));
  const handleLocationChange = (location: string) => setFormData(prev => ({ ...prev, location }));
  const handleTagsChange = (tags: string[]) => setFormData(prev => ({ ...prev, tags }));
  const handlePriceChange = (price?: number) => setFormData(prev => ({ ...prev, price }));
  const handlePricelessToggle = (priceless: boolean) => setFormData(prev => ({ ...prev, priceless, price: priceless ? undefined : prev.price }));
  const handleDateChange = (date?: Date) => setFormData(prev => ({ ...prev, acquisitionDate: date }));
  const handleExpiryDateChange = (date?: Date) => setFormData(prev => ({ ...prev, expiryDate: date }));
  const clearAcquisitionDate = () => setFormData(prev => ({ ...prev, acquisitionDate: undefined }));
  const clearExpiryDate = () => setFormData(prev => ({ ...prev, expiryDate: undefined }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter item name" required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter item description" rows={4} />
      </div>

      <div>
        <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-2">Item Visual</label>
          <div className="flex gap-2">
            <Button type="button" variant={!useIcon ? 'default' : 'outline'} onClick={() => handleImageMethodToggle(false)} className="flex-1">📷 Upload Image</Button>
            <Button type="button" variant={useIcon ? 'default' : 'outline'} onClick={() => handleImageMethodToggle(true)} className="flex-1">🎨 Use Icon</Button>
          </div>
        </div>
        {useIcon ? (
          <IconSelector selectedIcon={formData.iconType || null} onSelectIcon={handleIconChange} />
        ) : (
          <ImageUploader onImageChange={handleImageChange} previewUrl={imagePreviewUrl} />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !formData.acquisitionDate && "text-muted-foreground")} type="button">
                <CalendarIcon className="mr-2 h-4 w-4" />{formData.acquisitionDate ? format(formData.acquisitionDate, "PPP") : <span>When did you get this item?</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={formData.acquisitionDate} onSelect={handleDateChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent>
          </Popover>
          {formData.acquisitionDate && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearAcquisitionDate}
              className="flex-shrink-0"
              title="Clear acquisition date"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !formData.expiryDate && "text-muted-foreground")} type="button">
                <CalendarIcon className="mr-2 h-4 w-4" />{formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>When does this item expire?</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={formData.expiryDate} onSelect={handleExpiryDateChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent>
          </Popover>
          {formData.expiryDate && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearExpiryDate}
              className="flex-shrink-0"
              title="Clear expiry date"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <QuantityInput quantity={formData.quantity || 1} onChange={handleQuantityChange} />
      <LocationSelector value={formData.location || ''} onChange={handleLocationChange} />
      <TagSelector selectedTags={formData.tags || []} onChange={handleTagsChange} />
      <PriceInput price={formData.price} priceless={!!formData.priceless} onPriceChange={handlePriceChange} onPricelessToggle={handlePricelessToggle} />

      <div className="flex space-x-4 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;