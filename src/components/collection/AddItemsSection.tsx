
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Item } from "@/types";

interface AddItemsSectionProps {
  availableItems: Item[];
  onAddItem: (itemId: string) => void;
}

const AddItemsSection = ({ availableItems, onAddItem }: AddItemsSectionProps) => {
  if (availableItems.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Add Items</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {availableItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddItem(item.id)}
                  className="flex-shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddItemsSection;
