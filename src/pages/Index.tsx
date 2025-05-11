import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewMode } from "@/types";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import ItemCard from "@/components/ItemCard";
import ItemList from "@/components/ItemList";
import ViewToggle from "@/components/ViewToggle";
import AddItemButton from "@/components/AddItemButton";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { BarChart, MessageSquareMore, Download, Upload, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubFilter, setActiveSubFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { getActiveItems } = useItems();
  const navigate = useNavigate();
  
  // Get only active (non-archived) items
  const activeItems = getActiveItems();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Fixed filter change handler
  const handleFilterChange = (filter: string, subFilter?: string) => {
    // Always set the active filter first
    setActiveFilter(filter);
    
    // If filter is "all", or no subfilter provided, clear the subfilter
    if (filter === "all" || subFilter === undefined) {
      setActiveSubFilter(undefined);
    } else {
      // Otherwise set the subfilter
      setActiveSubFilter(subFilter);
    }
  };
  
  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  const clearSubFilter = () => {
    setActiveSubFilter(undefined);
  };

  const filteredItems = activeItems.filter(item => {
    // First apply search filter
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Then apply category filters
    if (activeFilter === "all") return true;
    
    switch (activeFilter) {
      case "tags":
        return activeSubFilter 
          ? item.tags.includes(activeSubFilter)
          : true;
      case "location":
        return activeSubFilter
          ? item.location === activeSubFilter
          : true;
      case "price":
        if (activeSubFilter === "priceless") {
          return item.priceless === true;
        } else if (activeSubFilter === "with-price") {
          return item.price !== undefined && item.price > 0;
        } else if (activeSubFilter === "no-price") {
          return (item.price === undefined || item.price === 0) && !item.priceless;
        }
        return true;
      default:
        return true;
    }
  });

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {/* Mobile and Desktop layout with improved responsive design */}
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
            <ViewToggle activeView={viewMode} onViewChange={handleViewChange} />
          </div>
        </div>
        
        {/* Filter tabs row - separate for desktop and mobile */}
        <div className="hidden md:block mb-4">
          <FilterTabs 
            onFilterChange={handleFilterChange} 
            activeFilter={activeFilter}
            activeSubFilter={activeSubFilter}
          />
        </div>
        
        {/* Mobile Filter Tabs - scrollable */}
        <div className="md:hidden mb-4">
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="inline-flex min-w-full">
              <FilterTabs 
                onFilterChange={handleFilterChange} 
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
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <ItemList items={filteredItems} />
      )}
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found. Try adjusting your filters or add new items!</p>
        </div>
      )}
      
      <AddItemButton onClick={() => navigate("/add-item")} />
    </div>
  );
};

export default Index;
