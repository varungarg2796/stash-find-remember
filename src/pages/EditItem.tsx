import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import ItemForm from '@/components/ItemForm';
import { Item } from '@/types';
import { useNavigationHelper } from '@/hooks/useNavigationHelper';
import { useItemQuery, useUpdateItemMutation } from '@/hooks/useItemsQuery';
import { useState } from 'react';
import { uploadsApi } from '@/services/api/uploadsApi';
import { toast } from 'sonner';
import ErrorDisplay from '@/components/ErrorDisplay';
import imageCompression from 'browser-image-compression';

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { navigateAfterItemAction } = useNavigationHelper();

  const { data: item, isLoading, error } = useItemQuery(id!);
  const updateItemMutation = useUpdateItemMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData: Omit<Item, 'id'>, imageFile?: File) => {
    if (!id) return;

    // --- THIS IS THE FIX ---
    // Create a new object containing only the fields the user can actually edit.
    // This matches the properties defined in your UpdateItemDto.
    const dataToSend: Partial<Item> = {
      name: formData.name,
      description: formData.description,
      quantity: formData.quantity,
      location: formData.location,
      tags: formData.tags,
      price: formData.price,
      priceless: formData.priceless,
      acquisitionDate: formData.acquisitionDate,
      expiryDate: formData.expiryDate,
      iconType: formData.iconType,
      imageUrl: formData.imageUrl,
    };
    // ----------------------

    if (imageFile) {
      setIsUploading(true);
      try {
        // --- COMPRESSION LOGIC (Identical to AddItem) ---
        const options = { maxSizeMB: 2, maxWidthOrHeight: 1200, useWebWorker: true };
        const compressedFile = await imageCompression(imageFile, options);
        // ------------------------------------------------

        const uploadResponse = await uploadsApi.uploadImage(compressedFile);
        dataToSend.imageUrl = uploadResponse.url;
        dataToSend.iconType = undefined; // Clear icon if image is uploaded
      } catch (error) {
        toast.error('Image upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    
    // If the user selected an icon, clear the imageUrl
    if(dataToSend.iconType) {
        dataToSend.imageUrl = undefined;
    }

    updateItemMutation.mutate(
      { id, data: dataToSend },
      {
        onSuccess: () => {
          navigateAfterItemAction();
        },
      }
    );
  };

  const handleCancel = () => {
    navigateAfterItemAction();
  };
  
  const isSubmitting = updateItemMutation.isPending || isUploading;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !item) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <ErrorDisplay title="Item Not Found" message="Could not load the item you want to edit." />
        <Button variant="outline" onClick={() => navigate('/my-stash')} className="mt-4">
          <ArrowLeft className="mr-2" size={18} /> Back to My Stash
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={handleCancel} className="mb-4" disabled={isSubmitting}>
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Edit size={24} className="mr-2 text-gray-600" />
        Edit Item
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isUploading ? 'Uploading Image...' : 'Save Changes'}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditItem;