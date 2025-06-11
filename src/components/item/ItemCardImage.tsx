
import { Package } from "lucide-react";
import { Item } from "@/types";

interface ItemCardImageProps {
  item: Item;
  onClick: () => void;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

const ItemCardImage = ({ item, onClick, isExpired, isExpiringSoon }: ItemCardImageProps) => {
  return (
    <div onClick={onClick} className="relative">
      <div className="aspect-square relative">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        ) : item.iconType ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg">
            <div className="text-6xl">
              {item.iconType}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center">
            <Package className="h-16 w-16 text-slate-400" />
          </div>
        )}
        
        {/* Expiry status indicator */}
        {isExpired && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Expired
          </div>
        )}
        {isExpiringSoon && !isExpired && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Expires Soon
          </div>
        )}

        {/* Quantity badge */}
        {item.quantity > 1 && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {item.quantity}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCardImage;
