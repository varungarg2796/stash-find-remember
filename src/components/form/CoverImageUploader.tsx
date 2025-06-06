
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Image, Camera } from "lucide-react";
import imageCompression from "browser-image-compression";

interface CoverImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

const CoverImageUploader = ({ imageUrl, onImageChange }: CoverImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(compressedFile);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {imageUrl ? (
        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Collection cover" 
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onImageChange("")}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {isUploading ? "Processing..." : "Add cover image"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverImageUploader;
