
import { X, Image, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }

    try {
      setIsUploading(true);

      // Compression options
      const options = {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1200, // Max width/height
        useWebWorker: true,
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);
      
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(compressedFile);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Add Photo
      </label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {imageUrl ? (
          <div className="relative w-32 h-32 mx-auto">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick
                onImageChange("");
              }}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <X size={14} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto text-gray-400" size={48} />
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
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Upload Image"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
