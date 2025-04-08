
import { Plus } from "lucide-react";

interface AddItemButtonProps {
  onClick: () => void;
}

const AddItemButton = ({ onClick }: AddItemButtonProps) => {
  return (
    <button 
      className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
      onClick={onClick}
    >
      <Plus className="text-white" size={24} />
    </button>
  );
};

export default AddItemButton;
