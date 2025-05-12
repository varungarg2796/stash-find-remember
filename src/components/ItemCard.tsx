
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { Edit, ExternalLink, Heart, Calendar, DollarSign, Book, Armchair, Monitor, Laptop, Tv, Gift, Image as ImageIcon, Camera } from "lucide-react";
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

// Map of icon types to components
const iconMap = {
  book: Book,
  armchair: Armchair,
  monitor: Monitor,
  laptop: Laptop,
  tv: Tv,
  gift: Gift,
  heart: Heart,
  image: ImageIcon,
  camera: Camera
};

const ItemCard = ({ item }: ItemCardProps) => {
  const { id, name, imageUrl, iconType, tags, quantity, location, priceless, createdAt, price } = item;
  const placeholderColor = getColorForItem(name);
  const isMobile = useIsMobile();
  const defaultImage = getDefaultImage(item);
  const { user } = useAuth();
  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : 
                         user?.preferences?.currency === 'GBP' ? '£' : 
                         user?.preferences?.currency === 'JPY' ? '¥' : '$';
  
  // Get icon component if iconType is specified
  const IconComponent = iconType && iconMap[iconType as keyof typeof iconMap];
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 bg-white transform hover:-translate-y-1 hover:scale-[1.01] transition-transform">
      <div className="relative">
        <div className="w-full overflow-hidden">
          <AspectRatio ratio={4/3} className="bg-gray-50">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : IconComponent ? (
              <div className={`w-full h-full flex items-center justify-center ${placeholderColor}`}>
                <IconComponent size={80} className="text-gray-700" />
              </div>
            ) : defaultImage ? (
              <img 
                src={defaultImage} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow hover:bg-gray-100 transition-colors hover:shadow-md"
          aria-label="Edit item"
        >
          <Edit size={16} className="text-gray-600" />
        </Link>
        
        {priceless && (
          <div className="absolute top-3 left-3 flex items-center bg-white/90 px-3 py-1 rounded-full shadow">
            <Heart size={16} className="text-red-500 mr-1 fill-red-500" />
            <span className="text-xs font-medium">Priceless</span>
          </div>
        )}
        
        {price && price > 0 && !priceless && (
          <div className="absolute top-3 left-3 flex items-center bg-white/90 px-3 py-1 rounded-full shadow">
            <DollarSign size={16} className="text-green-500 mr-1" />
            <span className="text-xs font-medium">{currencySymbol}{price.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <Link to={`/items/${id}`} className="block p-5 bg-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold line-clamp-1 text-gray-800">{name}</h3>
          <span className="text-sm bg-gray-50 text-gray-700 font-medium px-2 py-1 rounded-full">{quantity}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, isMobile ? 1 : 2).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
              {tag}
            </span>
          ))}
          {tags.length > (isMobile ? 1 : 2) && <span className="text-xs text-gray-500">+{tags.length - (isMobile ? 1 : 2)}</span>}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          {location && (
            <p className="flex items-center">
              <ExternalLink size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
          
          <p className="flex items-center ml-auto">
            <Calendar size={14} className="mr-1 flex-shrink-0" />
            <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
