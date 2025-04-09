
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { ArrowRight, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ItemListProps {
  items: Item[];
}

const ItemList = ({ items }: ItemListProps) => {
  return (
    <div className="flex flex-col space-y-3">
      {items.map((item) => (
        <Link to={`/items/${item.id}`} key={item.id} className="block">
          <div className="bg-white rounded-lg overflow-hidden card-shadow">
            <div className="flex items-center p-3">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                <AspectRatio ratio={1/1}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
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
              
              <div className="ml-3 flex-grow min-w-0">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                  {item.priceless && (
                    <div className="ml-2 flex items-center text-red-500 flex-shrink-0">
                      <Heart size={14} className="fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex space-x-2 overflow-hidden">
                    {item.tags.slice(0, 1).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full truncate">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 1 && <span className="text-xs text-gray-500">+{item.tags.length - 1}</span>}
                  </div>
                  <span className="text-sm text-gray-600 flex-shrink-0">Qty: {item.quantity}</span>
                </div>
              </div>
              
              <ArrowRight size={18} className="text-gray-400 ml-2 flex-shrink-0" />
            </div>
          </div>
        </Link>
      ))}
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found. Add some items to your stash!</p>
        </div>
      )}
    </div>
  );
};

export default ItemList;
