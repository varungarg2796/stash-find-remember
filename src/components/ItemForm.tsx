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
import ImageAnalysis from './ImageAnalysis';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, X, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ItemFormProps {
  initialData?: Partial<Item>;
  // The onSubmit now passes the raw File object separately
  onSubmit: (data: Omit<Item, 'id' | 'createdAt'>, imageFile?: File) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  isEditing?: boolean;
  quickAddMode?: boolean;
  onQuickAddToggle?: () => void;
}

const ItemForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel,
  isEditing = false,
  isSubmitting = false,
  quickAddMode = false,
  onQuickAddToggle
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
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(isEditing || !quickAddMode);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Smart defaults based on item name
  const getSmartPlaceholders = () => {
    const name = formData.name?.toLowerCase() || '';
    
    if (name.includes('book') || name.includes('novel') || name.includes('magazine')) {
      return {
        description: 'Author, genre, condition...',
        defaultQuantity: 1,
        suggestedTags: ['Books', 'Reading', 'Education']
      };
    } else if (name.includes('shirt') || name.includes('pants') || name.includes('jacket') || name.includes('dress')) {
      return {
        description: 'Size, color, brand, condition...',
        defaultQuantity: 1,
        suggestedTags: ['Clothing', 'Fashion']
      };
    } else if (name.includes('phone') || name.includes('laptop') || name.includes('tablet') || name.includes('computer')) {
      return {
        description: 'Model, specifications, condition...',
        defaultQuantity: 1,
        suggestedTags: ['Electronics', 'Technology']
      };
    } else if (name.includes('spoon') || name.includes('fork') || name.includes('plate') || name.includes('cup') || name.includes('bowl')) {
      return {
        description: 'Material, set size, condition...',
        defaultQuantity: 4,
        suggestedTags: ['Kitchen', 'Utensils']
      };
    }
    
    return {
      description: 'Add any additional details...',
      defaultQuantity: 1,
      suggestedTags: []
    };
  };
  
  const smartPlaceholders = getSmartPlaceholders();
  
  // Clean up the temporary object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisResult = (result: { name: string; tags: string[] }) => {
    // Just store the analysis result, don't auto-apply
    console.log('Analysis result received:', result);
    setIsAnalyzing(false);
  };

  const handleApplyName = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name: name
    }));
    toast.success(`Applied suggested name: "${name}"`);
  };

  const handleApplyTags = (tags: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags: [...new Set([...(prev.tags || []), ...tags])] // Merge tags, removing duplicates
    }));
    toast.success(`Applied ${tags.length} suggested tag${tags.length !== 1 ? 's' : ''}`);
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (formData.quantity && formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission during analysis
    if (isAnalyzing) {
      console.log('Preventing form submission during analysis');
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please fix the errors below.");
      return;
    }
    
    // The parent component (`AddItem.tsx`) now handles the submission logic
    onSubmit(formData as Omit<Item, 'id'|'createdAt'>, imageFile);
  };
  
  // --- Other Handlers ---
  const handleQuantityChange = (quantity: number) => {
    setFormData(prev => ({ ...prev, quantity }));
    if (errors.quantity) {
      setErrors(prev => ({ ...prev, quantity: '' }));
    }
  };
  
  const handleLocationChange = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };
  const handleTagsChange = (tags: string[]) => setFormData(prev => ({ ...prev, tags }));
  const handlePriceChange = (price?: number) => setFormData(prev => ({ ...prev, price }));
  const handlePricelessToggle = (priceless: boolean) => setFormData(prev => ({ ...prev, priceless, price: priceless ? undefined : prev.price }));
  const handleDateChange = (date?: Date) => setFormData(prev => ({ ...prev, acquisitionDate: date }));
  const handleExpiryDateChange = (date?: Date) => setFormData(prev => ({ ...prev, expiryDate: date }));
  const clearAcquisitionDate = () => setFormData(prev => ({ ...prev, acquisitionDate: undefined }));
  const clearExpiryDate = () => setFormData(prev => ({ ...prev, expiryDate: undefined }));
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const hasOptionalData = () => {
    return formData.description || formData.acquisitionDate || formData.expiryDate || 
           formData.price || formData.priceless || (formData.tags && formData.tags.length > 0);
  };
  
  const getOptionalFieldsCount = () => {
    let count = 0;
    if (formData.description) count++;
    if (formData.acquisitionDate) count++;
    if (formData.expiryDate) count++;
    if (formData.price || formData.priceless) count++;
    if (formData.tags && formData.tags.length > 0) count++;
    return count;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {/* Essential Fields */}
      <div className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            Item Name
            <Badge variant="destructive" className="text-xs px-1 py-0">Required</Badge>
          </label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="What item are you adding?" 
            required 
            className={`text-base sm:text-sm ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <LocationSelector value={formData.location || ''} onChange={handleLocationChange} />
          </div>
          
          <TagSelector selectedTags={formData.tags || []} onChange={handleTagsChange} />
          
          <div>
            <QuantityInput quantity={formData.quantity || 1} onChange={handleQuantityChange} />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Visual Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            Item Visual
            <Badge variant="secondary" className="text-xs px-1 py-0">Optional</Badge>
          </label>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant={!useIcon ? 'default' : 'outline'} 
              onClick={() => handleImageMethodToggle(false)} 
              className="flex-1 h-12 text-base sm:text-sm"
            >
              📷 Upload Image
            </Button>
            <Button 
              type="button" 
              variant={useIcon ? 'default' : 'outline'} 
              onClick={() => handleImageMethodToggle(true)} 
              className="flex-1 h-12 text-base sm:text-sm"
            >
              🎨 Use Icon
            </Button>
          </div>
        </div>
        {useIcon ? (
          <IconSelector selectedIcon={formData.iconType || null} onSelectIcon={handleIconChange} />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <ImageUploader onImageChange={handleImageChange} previewUrl={imagePreviewUrl} />
            
            {/* AI Image Analysis Component */}
            <ImageAnalysis 
              imageFile={imageFile || null}
              onAnalysisStart={handleAnalysisStart}
              onAnalysisResult={handleAnalysisResult}
              onApplyName={handleApplyName}
              onApplyTags={handleApplyTags}
            />
          </div>
        )}
      </div>

      
      {/* Optional Fields - Collapsible */}
      {(showOptionalFields || !quickAddMode) && (
        <div className="space-y-3 border-t pt-3">
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              Description
              <Badge variant="secondary" className="text-xs px-1 py-0">Optional</Badge>
            </label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder={smartPlaceholders.description} 
              rows={3}
              className="text-base sm:text-sm"
            />
            
            {/* Smart tag suggestions */}
            {smartPlaceholders.suggestedTags.length > 0 && !formData.tags?.some(tag => smartPlaceholders.suggestedTags.includes(tag)) && (
              <div className="mt-2 text-xs">
                <span className="text-gray-500">💡 Suggested tags: </span>
                {smartPlaceholders.suggestedTags.map((tag, index) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTagsChange([...(formData.tags || []), tag])}
                    className="text-xs h-6 px-2 ml-1 border border-gray-200 hover:bg-gray-100"
                  >
                    +{tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Dates Section */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection('dates')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {expandedSections.dates ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Dates
              <Badge variant="secondary" className="text-xs px-1 py-0">Optional</Badge>
              {(formData.acquisitionDate || formData.expiryDate) && (
                <Badge variant="outline" className="text-xs px-1 py-0">Set</Badge>
              )}
            </button>
            
            {expandedSections.dates && (
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">When did you get this?</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal h-12 text-base sm:text-sm", !formData.acquisitionDate && "text-muted-foreground")} type="button">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.acquisitionDate ? format(formData.acquisitionDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={formData.acquisitionDate} onSelect={handleDateChange} disabled={(date) => date > new Date()} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {formData.acquisitionDate && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={clearAcquisitionDate}
                        className="flex-shrink-0 h-12 w-12"
                        title="Clear acquisition date"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">When does it expire?</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal h-12 text-base sm:text-sm", !formData.expiryDate && "text-muted-foreground")} type="button">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Select date (optional)</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={formData.expiryDate} onSelect={handleExpiryDateChange} disabled={(date) => date < new Date()} initialFocus />
                      </PopoverContent>
                    </Popover>
                    {formData.expiryDate && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={clearExpiryDate}
                        className="flex-shrink-0 h-12 w-12"
                        title="Clear expiry date"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Price Section */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection('price')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {expandedSections.price ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Price & Value
              <Badge variant="secondary" className="text-xs px-1 py-0">Optional</Badge>
              {(formData.price || formData.priceless) && (
                <Badge variant="outline" className="text-xs px-1 py-0">Set</Badge>
              )}
            </button>
            
            {expandedSections.price && (
              <div className="pl-6">
                <PriceInput price={formData.price} priceless={!!formData.priceless} onPriceChange={handlePriceChange} onPricelessToggle={handlePricelessToggle} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 h-12 text-base sm:text-sm" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-12 text-base sm:text-sm" 
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;