
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import ViewToggle from "@/components/ViewToggle";
import { ViewMode } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, MenuIcon, MessageSquareMore, SortAsc, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/hooks/useItemFiltering";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterSectionProps {
  searchQuery: string;
  activeFilter: string;
  activeSubFilter?: string;
  viewMode: ViewMode;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string, subFilter?: string) => void;
  onViewChange: (view: ViewMode) => void;
  onSortChange: (sort: SortOption) => void;
  clearSubFilter: () => void;
  isLoading?: boolean;
}

const FilterSection = ({
  searchQuery,
  activeFilter,
  activeSubFilter,
  viewMode,
  sortBy,
  onSearchChange,
  onFilterChange,
  onViewChange,
  onSortChange,
  clearSubFilter,
  isLoading = false,
}: FilterSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="mb-4 sm:mb-6">
        <SearchBar 
          onSearch={onSearchChange} 
          isLoading={isLoading}
          initialValue={searchQuery}
          debounceDelay={500}
          minSearchLength={2}
        />
      </div>
      
      <div className="mb-6 sm:mb-8">
        {/* Top actions row */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-lg sm:text-xl font-bold">Your Items</h2>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Sort Dropdown - Smaller on mobile */}
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className={`${isMobile ? 'w-[100px] h-8 text-xs px-2' : 'w-[140px]'}`}>
                <SortAsc className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                <SelectValue placeholder={isMobile ? "Sort" : "Sort by"} />
              </SelectTrigger>
              <SelectContent align="end" className="z-50 w-[180px]">
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="quantity-high">Highest quantity</SelectItem>
                <SelectItem value="quantity-low">Lowest quantity</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Mobile Action Menu */}
            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <MenuIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50">
                  <DropdownMenuItem onClick={() => navigate("/bulk-import")}>
                    <Upload size={16} className="mr-2" />
                    Bulk Import
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/ask")}>
                    <MessageSquareMore size={16} className="mr-2" />
                    Ask Stasher
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/stats")}>
                    <BarChart size={16} className="mr-2" />
                    View Statistics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/bulk-import")}
                className="flex-shrink-0"
                title="Bulk Import"
              >
                <Upload size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/ask")}
                className="flex-shrink-0"
                title="Ask Stasher"
              >
                <MessageSquareMore size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate("/stats")}
                className="flex-shrink-0"
                title="View Statistics"
              >
                <BarChart size={18} />
              </Button>
            </div>
            <ViewToggle activeView={viewMode} onViewChange={onViewChange} />
          </div>
        </div>
        
        <div className="mb-4">
          <FilterTabs 
            onFilterChange={onFilterChange} 
            activeFilter={activeFilter}
            activeSubFilter={activeSubFilter}
          />
        </div>
      </div>
      
      {activeSubFilter && (
        <div className="mb-4 flex items-center flex-wrap">
          <span className="text-xs sm:text-sm bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full">
            Filtering by: {activeSubFilter}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-1 sm:ml-2 h-6 sm:h-7 text-xs"
            onClick={clearSubFilter}
          >
            Clear
          </Button>
        </div>
      )}
    </>
  );
};

export default FilterSection;
