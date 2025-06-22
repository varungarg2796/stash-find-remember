import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Package } from 'lucide-react';

import AddItemButton from '@/components/AddItemButton';
import FilterSection from '@/components/filter/FilterSection';
import ItemsDisplay from '@/components/items/ItemsDisplay';
import StashStats from '@/components/StashStats';
import ItemCardSkeleton from '@/components/ItemCardSkeleton';
import ErrorDisplay from '@/components/ErrorDisplay';

import { useItemsQuery } from '@/hooks/useItemsQuery';
import { FindAllItemsParams } from '@/services/api/itemsApi';
import { useNavigationHelper } from '@/hooks/useNavigationHelper';
import { SortOption } from '@/hooks/useItemFiltering'; // This type can be reused
import { ViewMode } from '@/types';

const MyStash = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { navigateWithState } = useNavigationHelper();

  // This state now directly drives the API query
  const [filters, setFilters] = useState<FindAllItemsParams>({
    page: 1,
    limit: 12,
    sort: 'newest',
    archived: false,
    search: '',
  });

  // The main data fetching hook
  const { data, isLoading, error } = useItemsQuery(filters);

  const hasItems = useMemo(() => (data?.data?.length ?? 0) > 0 || filters.search !== '', [data, filters]);

  // --- Filter and Pagination Handlers ---

  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('stashViewMode') as ViewMode) || 'grid'
  );

  const handleFilterChange = useCallback((filter: string, subFilter?: string) => {
    const newFilters = { ...filters, page: 1 };
    
    // Clear old filters before applying new ones
    delete newFilters.tag;
    delete newFilters.location;

    if (filter === 'tags') newFilters.tag = subFilter;
    if (filter === 'location') newFilters.location = subFilter;
    
    setFilters(newFilters);
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('stashViewMode', viewMode);
  }, [viewMode]);

  const handleViewChange = useCallback((view: ViewMode) => {
    setViewMode(view);
  }, []);
  
  const handleSortChange = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // --- Navigation Handlers ---

  const handleAddItem = useCallback(() => {
    navigateWithState('/add-item', '/my-stash');
  }, [navigateWithState]);

  const handleClearFilters = useCallback(() => {
    setFilters({ page: 1, limit: 12, sort: 'newest', archived: false, search: '' });
  }, []);

  // --- Render Logic ---

  if (!user) {
    // This can be a more elaborate "Please Login" component
    return (
        <div className="max-w-screen-md mx-auto px-4 py-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Your Stash!</h1>
            <p className="text-muted-foreground mb-4">Please log in to view and manage your items.</p>
            <Button onClick={() => navigate('/')}>Go to Homepage</Button>
        </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-screen-md mx-auto px-4 py-6">
        {!hasItems && !isLoading && (
          <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-none">
            <CardContent className="p-6 text-center">
              <Package className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Your Stash is Empty</h2>
              <p className="mt-2 text-gray-600">Start by adding your first item to begin organizing.</p>
              <Button onClick={handleAddItem} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        )}
        
        {hasItems && <StashStats />}
        
        <div className="space-y-6">
          <FilterSection 
            searchQuery={filters.search || ''}
            activeFilter={filters.tag ? 'tags' : filters.location ? 'location' : 'all'}
            activeSubFilter={filters.tag || filters.location}
            viewMode={viewMode} // This would need its own state if you want to toggle it
            sortBy={filters.sort as SortOption}
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
            onViewChange={handleViewChange}
            onSortChange={handleSortChange}
            clearSubFilter={handleClearFilters}
          />
          
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
              {Array.from({ length: 4 }).map((_, index) => (
                <ItemCardSkeleton key={index} viewMode={viewMode} />
              ))}
            </div>
          ) : error ? (
            <ErrorDisplay
              title="Could Not Fetch Items"
              message={error.message}
              onRetry={() => window.location.reload()} // Or refetch from query
            />
          ) : (
            <ItemsDisplay 
              items={data?.data || []}
              viewMode={viewMode} // This would also use the dedicated viewMode state
              enablePagination={true}
              // Pass pagination handlers to the display component
              currentPage={data?.currentPage}
              totalPages={data?.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        
        <AddItemButton onClick={handleAddItem} />
      </div>
    </TooltipProvider>
  );
};

export default MyStash;