import { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  // Accepts a file for a new upload, or null to clear
  onImageChange: (file: File | null) => void; 
  // Displays either an existing URL from the server or a temporary local preview URL
  previewUrl: string;
}

const ImageUploader = ({ onImageChange, previewUrl }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from triggering the file input
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Add Photo</label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
        
        {previewUrl ? (
          <div className="relative w-32 h-32 mx-auto">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm"
            >
              <X size={14} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto text-gray-400" size={48} />
            <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;