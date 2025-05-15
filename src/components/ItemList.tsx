
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { ArrowRight, Heart, Trash2, Archive, Clock, DollarSign, ArchiveRestore, Package } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getDefaultImage } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";
import { getColorForItem, getIconByName } from "@/utils/iconUtils";
import { cn } from "@/lib/utils";

interface ItemListProps {
  items: Item[];
  isArchive?: boolean;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

// Function to get date when item was archived
const getArchivedDate = (item: Item): Date | null => {
  if (!item.history) return null;
  
  const archivedEvent = [...item.history]
    .reverse()
    .find(h => h.action === "archived");
    
  return archivedEvent ? new Date(archivedEvent.date) : null;
};

const ItemList = ({ items, isArchive = false, onDelete, onRestore }: ItemListProps) => {
  const { user } = useAuth();
  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : 
                         user?.preferences?.currency === 'GBP' ? '£' : 
                         user?.preferences?.currency === 'JPY' ? '¥' : '$';
                         
  return (
    <div className="flex flex-col space-y-4">
      {items.map((item) => {
        const defaultImage = getDefaultImage(item);
        const IconComponent = getIconByName(item.iconType);
        const placeholderColor = getColorForItem(item.name);
        
        return (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="flex items-center p-4">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                <AspectRatio ratio={1/1}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : IconComponent ? (
                    <div className={cn("w-full h-full flex items-center justify-center", placeholderColor)}>
                      <IconComponent size={32} className="text-gray-700" />
                    </div>
                  ) : defaultImage ? (
                    <img
                      src={defaultImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl font-bold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </AspectRatio>
              </div>
              
              <div className="ml-4 flex-grow min-w-0">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                  {item.priceless && (
                    <div className="ml-2 flex items-center text-red-500 flex-shrink-0">
                      <Heart size={14} className="fill-current" />
                    </div>
                  )}
                  {item.price && item.price > 0 && !item.priceless && (
                    <div className="ml-2 flex items-center text-green-600 flex-shrink-0">
                      <DollarSign size={14} />
                      <span className="text-xs font-semibold">{currencySymbol}{item.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{item.description}</p>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex space-x-2 overflow-hidden">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full truncate font-medium">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isArchive ? (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {getArchivedDate(item) ? 
                          format(getArchivedDate(item) as Date, 'MMM d, yyyy') : 
                          format(new Date(item.createdAt), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                        <Package size={14} className="mr-1" />
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {isArchive ? (
                <div className="flex flex-col ml-3 space-y-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-400 hover:text-green-600 hover:bg-green-50"
                    onClick={() => onRestore && onRestore(item.id)}
                    title="Restore item"
                  >
                    <ArchiveRestore size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete && onDelete(item.id)}
                    title="Delete permanently"
                  >
                    <Trash2 size={18} />
                  </Button>
                  <Link to={`/items/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-800"
                      title="View details"
                    >
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to={`/items/${item.id}`} className="ml-2 flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100">
                  <ArrowRight size={18} className="text-indigo-500" />
                </Link>
              )}
            </div>
            
            {isArchive && (
              <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500">
                <Badge variant="outline" className="bg-gray-100">
                  <Archive size={10} className="mr-1" />
                  Archived
                </Badge>
              </div>
            )}
          </div>
        );
      })}
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found. Add some items to your stash!</p>
        </div>
      )}
    </div>
  );
};

export default ItemList;
