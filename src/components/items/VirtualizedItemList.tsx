
import React from 'react';
import { Item, ViewMode } from '@/types';
import ItemCard from '@/components/ItemCard';
import ItemList from '@/components/ItemList';
import { useVirtualization } from '@/hooks/useVirtualization';

interface VirtualizedItemListProps {
  items: Item[];
  viewMode: ViewMode;
  containerHeight?: number;
  itemHeight?: number;
  enableVirtualization?: boolean;
}

const VirtualizedItemList = ({ 
  items, 
  viewMode, 
  containerHeight = 600,
  itemHeight = viewMode === 'grid' ? 300 : 100,
  enableVirtualization = true
}: VirtualizedItemListProps) => {
  const shouldVirtualize = enableVirtualization && items.length > 50;

  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualization({
    items,
    itemHeight,
    containerHeight
  });

  if (!shouldVirtualize) {
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-4"}>
        {viewMode === "grid" ? (
          items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <ItemList items={items} />
        )}
      </div>
    );
  }

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-4"}>
            {viewMode === "grid" ? (
              visibleItems.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <ItemList items={visibleItems} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedItemList;
