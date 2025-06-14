
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import ItemForm from "@/components/ItemForm";
import { Item } from "@/types";
import { toast } from "sonner";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";

const AddItem = () => {
  const { addItem } = useItems();
  const navigate = useNavigate();
  const { navigateAfterItemAction } = useNavigationHelper();
  
  const handleSubmit = (data: Omit<Item, "id">) => {
    addItem(data);
    toast.success("Item added successfully");
    navigateAfterItemAction();
  };
  
  const handleCancel = () => {
    navigateAfterItemAction();
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Plus size={24} className="mr-2 text-gray-600" />
        Add New Item
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Add Item"
        />
      </div>
    </div>
  );
};

export default AddItem;
