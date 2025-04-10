
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
import { BarChart, MessageSquareMore, Download, Upload } from "lucide-react";

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

  const handleFilterChange = (filter: string, subFilter?: string) => {
    setActiveFilter(filter);
    setActiveSubFilter(subFilter);
  };
  
  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  const filteredItems = activeItems.filter(item => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Category filters
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
      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="mb-8 flex justify-between items-center">
        <FilterTabs 
          onFilterChange={handleFilterChange} 
          activeFilter={activeFilter}
          activeSubFilter={activeSubFilter}
        />
        <div className="flex items-center space-x-2">
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
          <ViewToggle activeView={viewMode} onViewChange={handleViewChange} />
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
            onClick={() => {
              setActiveSubFilter(undefined);
              handleFilterChange(activeFilter);
            }}
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
