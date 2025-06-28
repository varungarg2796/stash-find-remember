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

const AddItem = () => {
  const navigate = useNavigate();
  const { navigateAfterItemAction } = useNavigationHelper();
  const createItemMutation = useCreateItemMutation();
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={handleCancel} className="mb-4" disabled={isSubmitting}>
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Plus size={24} className="mr-2 text-gray-600" />
        Add New Item
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* We need to update ItemForm to handle imageFile separately */}
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isUploading ? 'Uploading Image...' : 'Add Item'}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddItem;