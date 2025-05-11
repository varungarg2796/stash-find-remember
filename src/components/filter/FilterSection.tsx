
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
import { BarChart, MenuIcon, MessageSquareMore, Upload } from "lucide-react";

interface FilterSectionProps {
  searchQuery: string;
  activeFilter: string;
  activeSubFilter?: string;
  viewMode: ViewMode;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string, subFilter?: string) => void;
  onViewChange: (view: ViewMode) => void;
  clearSubFilter: () => void;
}

const FilterSection = ({
  searchQuery,
  activeFilter,
  activeSubFilter,
  viewMode,
  onSearchChange,
  onFilterChange,
  onViewChange,
  clearSubFilter,
}: FilterSectionProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <SearchBar onSearch={onSearchChange} />
      </div>
      
      <div className="mb-8">
        {/* Top actions row */}
        <div className="flex justify-between items-center mb-6 gap-2">
          <h2 className="text-xl font-bold">Your Items</h2>
          
          <div className="flex items-center gap-2">
            {/* Mobile Action Menu */}
            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MenuIcon size={16} className="mr-1" />
                    <span className="text-xs">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
        
        {/* Filter tabs row - separate for desktop and mobile */}
        <div className="hidden md:block mb-4">
          <FilterTabs 
            onFilterChange={onFilterChange} 
            activeFilter={activeFilter}
            activeSubFilter={activeSubFilter}
          />
        </div>
        
        {/* Mobile Filter Tabs - scrollable */}
        <div className="md:hidden mb-4">
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="inline-flex min-w-full">
              <FilterTabs 
                onFilterChange={onFilterChange} 
                activeFilter={activeFilter}
                activeSubFilter={activeSubFilter}
              />
            </div>
          </div>
        </div>
      </div>
      
      {activeSubFilter && (
        <div className="mb-4 flex items-center">
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
            Filtering by: {activeSubFilter}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-7 text-xs"
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
