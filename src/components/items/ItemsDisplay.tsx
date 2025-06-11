import { Item, ViewMode } from "@/types";
import ItemCard from "@/components/ItemCard";
import ItemList from "@/components/ItemList";
import { usePagination } from "@/hooks/usePagination";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ItemsDisplayProps {
  items: Item[];
  viewMode: ViewMode;
  enablePagination?: boolean;
  itemsPerPage?: number;
  searchQuery?: string;
  activeFilter?: string;
  onClearFilters?: () => void;
  onAddItem?: () => void;
}

const ItemsDisplay = ({ 
  items, 
  viewMode, 
  enablePagination = false, 
  itemsPerPage = 12,
  searchQuery = "",
  activeFilter = "all",
  onClearFilters,
  onAddItem
}: ItemsDisplayProps) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({ totalItems: items.length, itemsPerPage });

  const displayItems = enablePagination 
    ? items.slice(paginatedData.startIndex, paginatedData.endIndex)
    : items;

  const renderPaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => goToPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => goToPage(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  const hasActiveFilters = searchQuery.trim() !== "" || activeFilter !== "all";

  return (
    <div className="space-y-6">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {displayItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <ItemList items={displayItems} />
      )}
      
      {displayItems.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          {hasActiveFilters ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">No items match your filters</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              {onClearFilters && (
                <Button onClick={onClearFilters} variant="outline" className="mt-4">
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">No items yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Start building your collection by adding your first item.
              </p>
              {onAddItem && (
                <Button onClick={onAddItem} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {enablePagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={goToPreviousPage}
                className={`cursor-pointer ${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={goToNextPage}
                className={`cursor-pointer ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ItemsDisplay;
