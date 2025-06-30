
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, Grid3X3, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewToggle from "@/components/ViewToggle";
import DraggableItemCard from "@/components/items/DraggableItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ViewMode } from "@/types";
import { motion, AnimatePresence } from 'framer-motion';

interface CollectionItemsSectionProps {
  isLoading: boolean;
  collectionItems: any[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onDragEnd: (event: any) => void;
  onRemoveItem: (itemId: string) => void;
}

const CollectionItemsSection = ({
  isLoading,
  collectionItems,
  viewMode,
  onViewModeChange,
  onDragEnd,
  onRemoveItem
}: CollectionItemsSectionProps) => {
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Collection Items
            </h2>
            <p className="text-sm text-gray-600">
              {!isLoading && collectionItems.length > 0 
                ? `${collectionItems.length} item${collectionItems.length === 1 ? '' : 's'} in this collection`
                : 'Manage and organize your items'
              }
            </p>
          </div>
        </div>
        
        {!isLoading && collectionItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ViewToggle 
              activeView={viewMode}
              onViewChange={onViewModeChange}
            />
          </motion.div>
        )}
      </div>
      
      {isLoading ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
          : "space-y-4"
        }>
          {Array.from({ length: 8 }).map((_, index) => (
            <ItemCardSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      ) : collectionItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
            <CardContent className="text-center py-16 px-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No items yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your collection by adding your first item. You can add existing items or create new ones.
              </p>
              <Button 
                onClick={() => navigate("/add-item")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext 
            items={collectionItems.map((item: any) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={viewMode}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
                  : "space-y-4"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {collectionItems.map((item: any, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: 'easeOut'
                    }}
                  >
                    <DraggableItemCard
                      item={item}
                      viewMode={viewMode}
                      onRemove={() => onRemoveItem(item.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      )}
    </motion.div>
  );
};

export default CollectionItemsSection;
