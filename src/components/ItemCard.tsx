
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { Edit, ExternalLink, Heart } from "lucide-react";

interface ItemCardProps {
  item: Item;
}

// Function to generate a consistent color based on item name
const getColorForItem = (name: string): string => {
  const colors = [
    "bg-blue-200", "bg-green-200", "bg-yellow-200", 
    "bg-red-200", "bg-purple-200", "bg-pink-200",
    "bg-indigo-200", "bg-teal-200", "bg-orange-200"
  ];
  
  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get positive value
  hash = Math.abs(hash);
  
  // Get index in color array
  const index = hash % colors.length;
  
  return colors[index];
};

const ItemCard = ({ item }: ItemCardProps) => {
  const { id, name, imageUrl, tags, quantity, location, priceless } = item;
  const placeholderColor = getColorForItem(name);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className="h-48 bg-gray-50 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${placeholderColor} text-gray-700 text-4xl font-bold`}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <Link 
          to={`/edit-item/${id}`}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Edit item"
        >
          <Edit size={16} className="text-gray-600" />
        </Link>
        
        {priceless && (
          <div className="absolute top-2 left-2 flex items-center bg-white/90 px-2 py-1 rounded-full shadow-sm">
            <Heart size={14} className="text-red-500 mr-1 fill-red-500" />
            <span className="text-xs font-medium">Priceless</span>
          </div>
        )}
      </div>
      
      <Link to={`/items/${id}`} className="block p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <span className="text-sm text-gray-600 font-medium">Qty: {quantity}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > 2 && <span className="text-xs text-gray-500">+{tags.length - 2}</span>}
        </div>
        
        {location && (
          <p className="text-xs text-gray-500 flex items-center">
            <span className="truncate">{location}</span>
            <ExternalLink size={12} className="ml-1 flex-shrink-0" />
          </p>
        )}
      </Link>
    </div>
  );
};

export default ItemCard;
