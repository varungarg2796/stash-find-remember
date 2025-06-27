
import { useState, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedSearch } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  debounceDelay?: number;
  minSearchLength?: number;
}

const SearchBar = ({ 
  onSearch, 
  isLoading = false,
  initialValue = "",
  placeholder = "Search your stash...",
  debounceDelay = 500,
  minSearchLength = 0
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const { searchQuery, debouncedQuery, isSearching, handleSearch } = useDebouncedSearch(
    onSearch,
    debounceDelay,
    minSearchLength
  );

  // Sync internal state with external initial value
  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
      handleSearch(initialValue);
    }
  }, [initialValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setInputValue("");
    handleSearch("");
  };

  const showSearching = isSearching || isLoading;
  const showClearButton = inputValue.length > 0;

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {showSearching ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Search size={20} />
        )}
      </div>
      <Input 
        type="text"
        placeholder={placeholder}
        value={inputValue}
        className="pl-10 pr-10 py-6 text-lg bg-gray-100 border-none rounded-full"
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {showClearButton && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X size={16} className="text-gray-500" />
        </Button>
      )}
      {minSearchLength > 0 && inputValue.length > 0 && inputValue.length < minSearchLength && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 px-3">
          Type at least {minSearchLength} characters to search
        </div>
      )}
    </div>
  );
};

export default SearchBar;
