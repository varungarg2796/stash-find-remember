
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getItem, deleteItem } = useItems();
  const navigate = useNavigate();
  
  const item = getItem(id || "");
  
  if (!item) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500">Item not found.</p>
        </div>
      </div>
    );
  }
  
  const handleEdit = () => {
    navigate(`/edit-item/${id}`);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(item.id);
      navigate("/");
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="aspect-video bg-gray-50 overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-6xl font-bold">
              {item.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag, index) => (
              <span key={index} className="item-tag">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{item.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Quantity</h2>
              <p className="text-gray-700">{item.quantity}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-700">{item.location}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button onClick={handleEdit} className="flex-1 mr-2">
              <Edit className="mr-2" size={18} />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1 ml-2">
              <Trash2 className="mr-2" size={18} />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
