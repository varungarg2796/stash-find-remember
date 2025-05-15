
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/AddItemButton";
import FilterSection from "@/components/filter/FilterSection";
import ItemsDisplay from "@/components/items/ItemsDisplay";
import StashStats from "@/components/StashStats";
import { useItemFiltering } from "@/hooks/useItemFiltering";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    activeFilter,
    activeSubFilter,
    viewMode,
    sortBy,
    filteredItems,
    handleSearch,
    handleFilterChange,
    handleViewChange,
    handleSortChange,
    clearSubFilter
  } = useItemFiltering();

  return (
    <TooltipProvider>
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <StashStats />
        
        <FilterSection 
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          activeSubFilter={activeSubFilter}
          viewMode={viewMode}
          sortBy={sortBy}
          onSearchChange={handleSearch}
          onFilterChange={handleFilterChange}
          onViewChange={handleViewChange}
          onSortChange={handleSortChange}
          clearSubFilter={clearSubFilter}
        />
        
        <ItemsDisplay 
          items={filteredItems}
          viewMode={viewMode}
        />
        
        <AddItemButton onClick={() => navigate("/add-item")} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
