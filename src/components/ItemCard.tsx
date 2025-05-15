
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { Edit, ExternalLink, Heart, Calendar, DollarSign, Package, Info } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { getDefaultImage } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";
import { getColorForItem, getIconByName } from "@/utils/iconUtils";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const { id, name, description, imageUrl, iconType, tags, quantity, location, priceless, createdAt, price } = item;
  const placeholderColor = getColorForItem(name);
  const isMobile = useIsMobile();
  const defaultImage = getDefaultImage(item);
  const { user } = useAuth();
  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : 
                         user?.preferences?.currency === 'GBP' ? '£' : 
                         user?.preferences?.currency === 'JPY' ? '¥' : '$';
  
  // Get icon component if iconType is specified
  const IconComponent = getIconByName(iconType);
  
  return (
    <Card className="overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group">
      <div className="relative">
        <AspectRatio ratio={4/3} className="bg-gray-50">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : IconComponent ? (
            <div className={cn("w-full h-full flex items-center justify-center", placeholderColor)}>
              <IconComponent size={80} className="text-gray-700" />
            </div>
          ) : defaultImage ? (
            <img 
              src={defaultImage} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center text-4xl font-bold text-gray-700", placeholderColor)}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </AspectRatio>
        
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
        
        <div className="absolute bottom-3 right-3 flex items-center bg-white/90 px-3 py-1 rounded-full shadow">
          <Package size={16} className="text-purple-500 mr-1" />
          <span className="text-xs font-medium">{quantity}</span>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <Link to={`/items/${id}`} className="block">
          <h3 className="text-lg font-semibold line-clamp-1 text-gray-800 group-hover:text-purple-700 transition-colors">
            {name}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4">
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[2.5rem]">{description}</p>
        )}
        {!description && (
          <p className="text-sm text-gray-400 italic line-clamp-2 mb-3 min-h-[2.5rem]">No description</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.slice(0, isMobile ? 1 : 2).map((tag, index) => (
            <span key={index} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
          {tags.length > (isMobile ? 1 : 2) && 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-500 font-medium cursor-help flex items-center">
                    <Info size={12} className="mr-1" />
                    +{tags.length - (isMobile ? 1 : 2)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {tags.slice(isMobile ? 1 : 2).join(", ")}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-xs text-gray-500 border-t border-gray-100 flex justify-between items-center">
        {location && (
          <p className="flex items-center">
            <ExternalLink size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{location}</span>
          </p>
        )}
        
        <p className="flex items-center ml-auto">
          <Calendar size={14} className="mr-1 flex-shrink-0" />
          <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
