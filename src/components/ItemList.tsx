
import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '@/types';
import { getTagColor } from '@/lib/utils';
import { getIconByName } from '@/utils/iconUtils';
import { Package } from 'lucide-react';

interface ItemListProps {
  items: Item[];
  isArchive?: boolean;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  isArchive = false,
  onDelete,
  onRestore
}) => {
  return (
    <div className="space-y-3">
      {items.map(item => {
        const IconComponent = getIconByName(item.iconType);
        
        return (
          <Link 
            to={`/items/${item.id}`} 
            key={item.id}
            className="block"
          >
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : IconComponent ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <IconComponent className="h-8 w-8 text-slate-600" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg truncate pr-2">{item.name}</h3>
                  {item.quantity && item.quantity > 1 && (
                    <span className="flex-shrink-0 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {item.quantity}x
                    </span>
                  )}
                </div>
                
                {item.location && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.location}
                  </p>
                )}
                
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: getTagColor(tag) }}
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
      
      {items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">No items found.</p>
        </div>
      )}
    </div>
  );
};

export default ItemList;
