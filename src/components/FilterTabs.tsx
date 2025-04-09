
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
  
  // Extract unique tags and locations for subfilters
  const uniqueTags = [...new Set(items.flatMap(item => item.tags))].sort();
  const uniqueLocations = [...new Set(items.map(item => item.location).filter(Boolean))].sort();
  
  const filters = [
    { id: "all", label: "All Items" },
    { id: "tags", label: "By Tag", hasSubFilters: true },
    { id: "location", label: "By Location", hasSubFilters: true },
    { id: "unused", label: "Unused" },
    { id: "priceless", label: "Priceless" },
  ];
  
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    setActiveSubFilter(undefined);
    onFilterChange(filterId);
  };
  
  const handleSubFilterClick = (subFilter: string) => {
    setActiveSubFilter(subFilter);
    onFilterChange(activeFilter, subFilter);
  };
  
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          {filter.hasSubFilters ? (
            <DropdownMenu>
              <DropdownMenuTrigger 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none
                  ${activeFilter === filter.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary hover:bg-secondary/80"}`}
              >
                {filter.label}
                <ChevronDown size={16} className="ml-1 inline" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto z-50 bg-white">
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none
                ${activeFilter === filter.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"}`}
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
