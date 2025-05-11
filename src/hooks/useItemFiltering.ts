import { useState } from "react";
import { Item, ViewMode } from "@/types";
import { useItems } from "@/context/ItemsContext";

export function useItemFiltering() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubFilter, setActiveSubFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { getActiveItems } = useItems();
  
  const activeItems = getActiveItems();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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

  return {
    searchQuery,
    activeFilter,
    activeSubFilter,
    viewMode,
    filteredItems,
    handleSearch,
    handleFilterChange,
    handleViewChange,
    clearSubFilter
  };
}
