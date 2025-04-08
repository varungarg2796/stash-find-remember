
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Tag, MapPin } from "lucide-react";

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

  // Function to generate a consistent color based on item name
  const getColorForItem = (name: string): string => {
    const colors = [
      "bg-blue-200", "bg-green-200", "bg-yellow-200", 
      "bg-red-200", "bg-purple-200", "bg-pink-200",
      "bg-indigo-200", "bg-teal-200", "bg-orange-200"
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    hash = Math.abs(hash);
    const index = hash % colors.length;
    
    return colors[index];
  };

  const placeholderColor = getColorForItem(item.name);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="aspect-video bg-gray-50 overflow-hidden relative">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${placeholderColor} text-gray-700 text-6xl font-bold`}>
              {item.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <Button 
            onClick={handleEdit}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800"
            size="sm"
          >
            <Edit className="mr-2" size={16} />
            Edit Item
          </Button>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag, index) => (
              <span key={index} className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                <Tag size={14} className="mr-1 text-gray-500" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{item.description || "No description provided."}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-1">Quantity</h2>
              <p className="text-2xl font-bold text-gray-800">{item.quantity}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-1">Location</h2>
              <p className="text-gray-700 flex items-center">
                <MapPin size={16} className="mr-1 text-gray-500" />
                {item.location || "Not specified"}
              </p>
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
