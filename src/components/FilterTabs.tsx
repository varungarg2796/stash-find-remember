
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DollarSign, Filter } from "lucide-react";
import { useItems } from "@/context/ItemsContext";

interface FilterTabsProps {
  onFilterChange: (filter: string, subFilter?: string) => void;
  activeFilter: string;
  activeSubFilter?: string;
}

const FilterTabs = ({ onFilterChange, activeFilter, activeSubFilter }: FilterTabsProps) => {
  const { getActiveItems } = useItems();
  
  // Extract unique tags and locations for subfilters from active items only
  const activeItems = getActiveItems();
  const uniqueTags = [...new Set(activeItems.flatMap(item => item.tags))].sort();
  const uniqueLocations = [...new Set(activeItems.map(item => item.location).filter(Boolean))].sort();
  
  const filters = [
    { id: "all", label: "All Items" },
    { id: "tags", label: "By Tag", hasSubFilters: true },
    { id: "location", label: "By Location", hasSubFilters: true },
    { id: "price", label: "By Price", hasSubFilters: true, icon: <DollarSign size={16} className="mr-1" /> }
  ];
  
  // Updated to properly handle filter clicks
  const handleFilterClick = (filterId: string) => {
    // If clicking on any filter, clear any subfilters and set the active filter
    if (filterId !== activeFilter) {
      onFilterChange(filterId);
    }
  };
  
  const handleSubFilterClick = (subFilter: string, parentFilter: string) => {
    // Pass both the parent filter and subfilter
    onFilterChange(parentFilter, subFilter);
  };
  
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          {filter.hasSubFilters ? (
            <DropdownMenu>
              <DropdownMenuTrigger 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none flex items-center
                  ${activeFilter === filter.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary hover:bg-secondary/80"}`}
              >
                {filter.icon}
                {filter.label}
                <ChevronDown size={16} className="ml-1 inline" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto z-50 bg-popover shadow-md">
                {filter.id === "tags" && uniqueTags.map(tag => (
                  <DropdownMenuItem 
                    key={tag} 
                    className={activeSubFilter === tag ? "bg-muted" : ""}
                    onClick={() => handleSubFilterClick(tag, filter.id)}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
                {filter.id === "location" && uniqueLocations.map(location => (
                  <DropdownMenuItem 
                    key={location} 
                    className={activeSubFilter === location ? "bg-muted" : ""}
                    onClick={() => handleSubFilterClick(location, filter.id)}
                  >
                    {location}
                  </DropdownMenuItem>
                ))}
                {filter.id === "price" && [
                  { id: "priceless", label: "Priceless Items" },
                  { id: "with-price", label: "Items with Price" },
                  { id: "no-price", label: "Items without Price" }
                ].map(priceFilter => (
                  <DropdownMenuItem 
                    key={priceFilter.id} 
                    className={activeSubFilter === priceFilter.id ? "bg-muted" : ""}
                    onClick={() => handleSubFilterClick(priceFilter.id, filter.id)}
                  >
                    {priceFilter.label}
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
