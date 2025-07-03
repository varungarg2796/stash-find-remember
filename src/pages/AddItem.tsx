import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import ItemForm from '@/components/ItemForm';
import { Item } from '@/types';
import { useNavigationHelper } from '@/hooks/useNavigationHelper';
import { useCreateItemMutation } from '@/hooks/useItemsQuery';
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadsApi } from '@/services/api/uploadsApi';
import imageCompression from 'browser-image-compression';
import { Switch } from '@/components/ui/switch';

const AddItem = () => {
  const navigate = useNavigate();
  const { navigateAfterItemAction } = useNavigationHelper();
  const createItemMutation = useCreateItemMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState(true);

  const handleSubmit = async (formData: Omit<Item, 'id'>, imageFile?: File) => {
    // --- THIS IS THE FIX ---
    // Destructure to remove server-generated fields before sending
    const { createdAt, ...dataToSend } = formData;
    const finalData: Partial<Item> = { ...dataToSend };
    // ----------------------

    if (imageFile) {
      setIsUploading(true);
      try {
        console.log(`Original image size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
        const options = {
          maxSizeMB: 2, // Target size in MB
          maxWidthOrHeight: 1200, // Resize the image
          useWebWorker: true, // Use a web worker for better performance
        };
        const compressedFile = await imageCompression(imageFile, options);
        console.log(`Compressed image size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        const uploadResponse = await uploadsApi.uploadImage(compressedFile);
        finalData.imageUrl = uploadResponse.url;
      } catch (error) {
        toast.error('Image upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    createItemMutation.mutate(finalData, {
      onSuccess: () => {
        navigateAfterItemAction();
      },
    });
  };

  const handleCancel = () => {
    navigateAfterItemAction();
  };

  const isSubmitting = createItemMutation.isPending || isUploading;
  
  const toggleQuickAddMode = () => {
    setQuickAddMode(!quickAddMode);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={handleCancel} className="h-10 sm:h-auto" disabled={isSubmitting}>
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Quick Add</span>
          <Switch 
            checked={!quickAddMode}
            onCheckedChange={(checked) => setQuickAddMode(!checked)}
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-600">Full Form</span>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
          <Plus size={20} className="mr-2 text-gray-600 sm:w-6 sm:h-6" />
          {quickAddMode ? 'Quick Add Item' : 'Add New Item'}
        </h1>
        {quickAddMode && (
          <p className="text-sm text-gray-600 mt-1">
            Add the essentials now, details later
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isUploading ? 'Uploading Image...' : (quickAddMode ? 'Quick Add' : 'Add Item')}
          isSubmitting={isSubmitting}
          quickAddMode={quickAddMode}
          onQuickAddToggle={toggleQuickAddMode}
        />
      </div>
    </div>
  );
};

export default AddItem;