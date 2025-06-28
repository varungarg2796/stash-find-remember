import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value, delaying updates until after a specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced search functionality
 * @param onSearch - Callback function to execute when search is triggered
 * @param delay - The debounce delay in milliseconds (default: 500ms)
 * @param minLength - Minimum character length before triggering search (default: 0)
 * @returns Object with search query, debouncedQuery, isSearching state, and handleSearch function
 */
export function useDebouncedSearch(
  onSearch: (query: string) => void,
  delay: number = 500,
  minLength: number = 0
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, delay);

  useEffect(() => {
    if (debouncedQuery.length >= minLength || debouncedQuery === '') {
      setIsSearching(false);
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, minLength]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= minLength || query === '') {
      setIsSearching(true);
    }
  };

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    handleSearch,
  };
}