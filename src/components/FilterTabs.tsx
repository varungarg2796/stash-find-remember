
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useItems } from "@/context/ItemsContext";

interface FilterTabsProps {
  onFilterChange: (filter: string, subFilter?: string) => void;
}

const FilterTabs = ({ onFilterChange }: FilterTabsProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubFilter, setActiveSubFilter] = useState<string | undefined>(undefined);
  const { items } = useItems();
  
  const filters = [
    { id: "all", label: "All" },
    { id: "tags", label: "Tags", hasSubFilters: true },
    { id: "location", label: "Location", hasSubFilters: true },
    { id: "unused", label: "Unused" },
  ];
  
  // Extract unique tags and locations for subfilters
  const uniqueTags = [...new Set(items.flatMap(item => item.tags))];
  const uniqueLocations = [...new Set(items.map(item => item.location))].filter(Boolean);
  
  const handleFilterClick = (filterId: string) => {
    if (filterId !== activeFilter) {
      setActiveFilter(filterId);
      setActiveSubFilter(undefined);
      onFilterChange(filterId);
    }
  };
  
  const handleSubFilterClick = (subFilter: string) => {
    setActiveSubFilter(subFilter);
    onFilterChange(activeFilter, subFilter);
  };
  
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          {filter.hasSubFilters ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={`filter-tab flex items-center ${activeFilter === filter.id ? "active" : ""}`}>
                {filter.label}
                <ChevronDown size={16} className="ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {filter.id === "tags" && uniqueTags.map(tag => (
                  <DropdownMenuItem 
                    key={tag} 
                    className={activeSubFilter === tag ? "bg-muted" : ""}
                    onClick={() => handleSubFilterClick(tag)}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
                {filter.id === "location" && uniqueLocations.map(location => (
                  <DropdownMenuItem 
                    key={location} 
                    className={activeSubFilter === location ? "bg-muted" : ""}
                    onClick={() => handleSubFilterClick(location as string)}
                  >
                    {location}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className={`filter-tab ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterTabs;
