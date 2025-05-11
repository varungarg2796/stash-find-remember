
import { Item, ViewMode } from "@/types";
import ItemCard from "@/components/ItemCard";
import ItemList from "@/components/ItemList";

interface ItemsDisplayProps {
  items: Item[];
  viewMode: ViewMode;
}

const ItemsDisplay = ({ items, viewMode }: ItemsDisplayProps) => {
  return (
    <>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <ItemList items={items} />
      )}
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found. Try adjusting your filters or add new items!</p>
        </div>
      )}
    </>
  );
};

export default ItemsDisplay;
