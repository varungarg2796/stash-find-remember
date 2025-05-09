
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { Edit, ExternalLink, Heart, Calendar, DollarSign } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { getDefaultImage } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";

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
  const { id, name, imageUrl, tags, quantity, location, priceless, createdAt, price } = item;
  const placeholderColor = getColorForItem(name);
  const isMobile = useIsMobile();
  const defaultImage = getDefaultImage(item);
  const { user } = useAuth();
  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : 
                         user?.preferences?.currency === 'GBP' ? '£' : 
                         user?.preferences?.currency === 'JPY' ? '¥' : '$';
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className="w-full overflow-hidden">
          <AspectRatio ratio={4/3} className="bg-gray-50">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : defaultImage ? (
              <img 
                src={defaultImage} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${placeholderColor} text-gray-700 text-4xl font-bold`}>
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </AspectRatio>
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
        
        {price && price > 0 && !priceless && (
          <div className="absolute top-2 left-2 flex items-center bg-white/90 px-2 py-1 rounded-full shadow-sm">
            <DollarSign size={14} className="text-green-500 mr-1" />
            <span className="text-xs font-medium">{currencySymbol}{price.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <Link to={`/items/${id}`} className="block p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <span className="text-sm text-gray-600 font-medium">Qty: {quantity}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, isMobile ? 1 : 2).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > (isMobile ? 1 : 2) && <span className="text-xs text-gray-500">+{tags.length - (isMobile ? 1 : 2)}</span>}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          {location && (
            <p className="flex items-center">
              <ExternalLink size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
          
          <p className="flex items-center ml-auto">
            <Calendar size={12} className="mr-1 flex-shrink-0" />
            <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
