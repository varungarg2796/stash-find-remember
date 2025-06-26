
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewToggle from "@/components/ViewToggle";
import DraggableItemCard from "@/components/items/DraggableItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ViewMode } from "@/types";

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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Items {!isLoading && `(${collectionItems.length})`}
        </h2>
        {!isLoading && collectionItems.length > 0 && (
          <ViewToggle 
            activeView={viewMode}
            onViewChange={onViewModeChange}
          />
        )}
      </div>
      
      {isLoading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
          {Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      ) : collectionItems.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground mb-4">No items in this collection yet.</p>
            <Button 
              onClick={() => navigate("/add-item")}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
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
            <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
              {collectionItems.map((item: any) => (
                <DraggableItemCard
                  key={item.id}
                  item={item}
                  viewMode={viewMode}
                  onRemove={() => onRemoveItem(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default CollectionItemsSection;
