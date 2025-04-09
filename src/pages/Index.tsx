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
import { BarChart, MessageSquareMore } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubFilter, setActiveSubFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { items } = useItems();
  const navigate = useNavigate();

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

  const handleAddItem = () => {
    navigate("/add-item");
  };

  const navigateToStats = () => {
    navigate("/stats");
  };
  
  const navigateToAskStasher = () => {
    navigate("/ask");
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case "tags":
        return activeSubFilter 
          ? item.tags.includes(activeSubFilter)
          : item.tags.length > 0;
      case "location":
        return activeSubFilter
          ? item.location === activeSubFilter
          : !!item.location;
      case "unused":
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
        <FilterTabs onFilterChange={handleFilterChange} />
        <div className="flex items-center space-x-2">
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
            onClick={() => setActiveSubFilter(undefined)}
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
          <p className="text-gray-500">No items found. Add some items to your stash!</p>
        </div>
      )}
      
      <AddItemButton onClick={() => navigate("/add-item")} />
    </div>
  );
};

export default Index;
