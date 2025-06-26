import { Item, ViewMode } from '@/types';
import ItemCard from '@/components/ItemCard';
import ItemList from '@/components/ItemList';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useMemo } from 'react';

interface ItemsDisplayProps {
  items: Item[];
  viewMode: ViewMode;
  enablePagination?: boolean;
  
  // New props for externally controlled pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  searchQuery?: string;
  activeFilter?: string;
  onClearFilters?: () => void;
  onAddItem?: () => void;
}

const ItemsDisplay = ({ 
  items, 
  viewMode, 
  enablePagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  searchQuery = "",
  activeFilter = "all",
  onClearFilters,
  onAddItem
}: ItemsDisplayProps) => {

  // The component no longer needs its own usePagination hook.
  // It uses the items array directly as it's already paginated by the parent.

  const renderPaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => onPageChange(i)} isActive={currentPage === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Logic for rendering ellipsis and page numbers remains the same,
      // but it uses the props `currentPage` and `totalPages`.
      pages.push( <PaginationItem key={1}><PaginationLink onClick={() => onPageChange(1)} isActive={currentPage === 1} className="cursor-pointer">1</PaginationLink></PaginationItem> );
      if (currentPage > 3) { pages.push(<PaginationItem key="ellipsis1"><PaginationEllipsis /></PaginationItem>); }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) { pages.push(<PaginationItem key={i}><PaginationLink onClick={() => onPageChange(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink></PaginationItem>); }
      if (currentPage < totalPages - 2) { pages.push(<PaginationItem key="ellipsis2"><PaginationEllipsis /></PaginationItem>); }
      if (totalPages > 1) { pages.push(<PaginationItem key={totalPages}><PaginationLink onClick={() => onPageChange(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">{totalPages}</PaginationLink></PaginationItem>); }
    }
    return pages;
  };

  const hasActiveFilters = searchQuery.trim() !== "" || activeFilter !== "all";

  return (
    <div className="space-y-6">
      {items.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        ) : (
          <ItemList items={items} />
        )
      ) : (
        // Empty state logic
        <div className="text-center py-12 animate-fade-in">
          {hasActiveFilters ? (
            <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4"><X className="h-8 w-8 text-gray-400" /></div>
                <h3 className="text-lg font-semibold">No items match your filters</h3>
                {onClearFilters && <Button onClick={onClearFilters} variant="outline"><X className="mr-2 h-4 w-4" /> Clear Filters</Button>}
            </div>
          ) : (
            <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4"><Plus className="h-8 w-8 text-indigo-600" /></div>
                <h3 className="text-lg font-semibold">No items yet</h3>
                {onAddItem && <Button onClick={onAddItem}><Plus className="mr-2 h-4 w-4" /> Add Your First Item</Button>}
            </div>
          )}
        </div>
      )}

      {enablePagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext onClick={() => onPageChange(currentPage + 1)} className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ItemsDisplay;