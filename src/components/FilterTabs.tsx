
import { useState } from "react";

interface FilterTabsProps {
  onFilterChange: (filter: string) => void;
}

const FilterTabs = ({ onFilterChange }: FilterTabsProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filters = [
    { id: "all", label: "All" },
    { id: "tags", label: "Tags" },
    { id: "location", label: "Location" },
    { id: "unused", label: "Unused" },
  ];
  
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };
  
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-tab ${activeFilter === filter.id ? "active" : ""}`}
          onClick={() => handleFilterClick(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
