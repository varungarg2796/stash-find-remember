
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { items } = useItems();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  const handleAddItem = () => {
    navigate("/add-item");
  };

  // Filter items based on search query and active filter
  const filteredItems = items.filter(item => {
    // First apply search filter
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Then apply category filter
    switch (activeFilter) {
      case "tags":
        return item.tags.length > 0;
      case "location":
        return !!item.location;
      case "unused":
        return true; // In a real app, we would check usage history
      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Stasher</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="mb-8 flex justify-between items-center">
        <FilterTabs onFilterChange={handleFilterChange} />
        <ViewToggle activeView={viewMode} onViewChange={handleViewChange} />
      </div>
      
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
      
      <AddItemButton onClick={handleAddItem} />
    </div>
  );
};

export default Index;
