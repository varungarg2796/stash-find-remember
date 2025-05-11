
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/AddItemButton";
import FilterSection from "@/components/filter/FilterSection";
import ItemsDisplay from "@/components/items/ItemsDisplay";
import { useItemFiltering } from "@/hooks/useItemFiltering";

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
    <div className="max-w-screen-md mx-auto px-4 py-6">
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
  );
};

export default Index;
