
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";

interface DraggableItemCardProps {
  item: any;
  onRemove: () => void;
  viewMode: 'grid' | 'list';
}

const DraggableItemCard = ({ item, onRemove, viewMode }: DraggableItemCardProps) => {
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

  if (viewMode === 'list') {
    return (
      <Card ref={setNodeRef} style={style} className="touch-manipulation">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-12 h-12 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{item.name}</h3>
              {item.collectionNote && (
                <p className="text-sm text-muted-foreground truncate">{item.collectionNote}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={setNodeRef} style={style} className="touch-manipulation">
      <div className="relative">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1 bg-white/80 rounded cursor-grab active:cursor-grabbing hover:bg-white"
        >
          <GripVertical className="h-4 w-4 text-gray-600" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium truncate">{item.name}</h3>
        {item.collectionNote && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.collectionNote}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DraggableItemCard;
