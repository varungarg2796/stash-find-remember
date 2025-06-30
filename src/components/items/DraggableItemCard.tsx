
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Tag, MapPin } from "lucide-react";
import ItemImage from "@/components/item/ItemImage";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface DraggableItemCardProps {
  item: any;
  onRemove?: () => void;
  viewMode: 'grid' | 'list';
  isReadOnly?: boolean;
}

const DraggableItemCard = ({ item, onRemove, viewMode, isReadOnly = false }: DraggableItemCardProps) => {
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleItemClick = () => {
    navigate(`/items/${item.id}?from=collections`);
  };


  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          ref={setNodeRef} 
          style={style} 
          className="touch-manipulation border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {!isReadOnly && (
                <motion.div
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing p-2 hover:bg-purple-100 rounded-lg transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                </motion.div>
              )}
              
              <div 
                className="cursor-pointer"
                onClick={handleItemClick}
                title="Click to view item details"
              >
                <ItemImage 
                  item={item}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border-2 border-white shadow-sm hover:border-purple-200 transition-colors"
                  iconSize="h-10 w-10"
                  fallbackIconSize="h-10 w-10"
                />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <h3 
                  className="font-semibold text-lg text-gray-900 truncate cursor-pointer hover:text-purple-700 transition-colors"
                  onClick={handleItemClick}
                  title="Click to view item details"
                >
                  {item.name}
                </h3>
                
                {item.collectionNote && (
                  <p className="text-sm text-gray-600 line-clamp-2">{item.collectionNote}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{item.tags.slice(0, 2).join(', ')}{item.tags.length > 2 ? '...' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {!isReadOnly && onRemove && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="flex-shrink-0 hover:bg-red-100 hover:text-red-600 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        ref={setNodeRef} 
        style={style} 
        className="touch-manipulation border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm overflow-hidden group"
      >
        <div className="relative">
          <div 
            className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
            onClick={handleItemClick}
            title="Click to view item details"
          >
            <ItemImage 
              item={item}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              iconSize="h-16 w-16"
              fallbackIconSize="h-16 w-16"
            />
          </div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {!isReadOnly && (
            <motion.div
              {...attributes}
              {...listeners}
              className="absolute top-3 left-3 p-2 bg-white/90 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <GripVertical className="h-4 w-4 text-gray-600" />
            </motion.div>
          )}
          
          {!isReadOnly && onRemove && (
            <motion.div
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="bg-white/90 hover:bg-red-100 hover:text-red-600 shadow-sm rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <h3 
            className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors cursor-pointer"
            onClick={handleItemClick}
            title="Click to view item details"
          >
            {item.name}
          </h3>
          
          {item.collectionNote && (
            <p className="text-sm text-gray-600 line-clamp-2">{item.collectionNote}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {item.location && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                <MapPin className="h-3 w-3 text-blue-600" />
                <span className="text-blue-700 font-medium">{item.location}</span>
              </div>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                <Tag className="h-3 w-3 text-purple-600" />
                <span className="text-purple-700 font-medium">
                  {item.tags.slice(0, 1).join(', ')}{item.tags.length > 1 ? `+${item.tags.length - 1}` : ''}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DraggableItemCard;
