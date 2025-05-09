
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import ItemForm from "@/components/ItemForm";
import { Item } from "@/types";
import { toast } from "sonner";

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const { getItem, updateItem } = useItems();
  const navigate = useNavigate();
  
  const item = getItem(id || "");
  
  if (!item) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500">Item not found.</p>
        </div>
      </div>
    );
  }
  
  const handleSubmit = (data: Omit<Item, "id">) => {
    updateItem({ ...data, id: item.id });
    toast.success("Item updated successfully");
    navigate("/"); // Navigate to home page
  };
  
  const handleCancel = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
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
          submitLabel="Save Changes"
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditItem;
