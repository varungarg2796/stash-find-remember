
import { X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  getPlaceholderImage: (name: string) => string;
  itemName: string;
}

const ImageUploader = ({ 
  imageUrl, 
  onImageChange, 
  getPlaceholderImage,
  itemName
}: ImageUploaderProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Add Photo
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {imageUrl ? (
          <div className="relative w-32 h-32 mx-auto">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => onImageChange("")}
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
        
        {!imageUrl && (
          <Button 
            type="button" 
            variant="outline" 
            className="mt-4"
            onClick={() => onImageChange(getPlaceholderImage(itemName))}
          >
            Simulate Upload
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
