import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, Package, Camera, Search, MapPin, Tag, ArrowRight, CheckCircle, MessageSquareMore } from 'lucide-react';

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
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/services/api/statsApi';

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

  // The main data fetching hook - only fetch if user is logged in
  const { data, isLoading, error } = useItemsQuery(filters, !!user);

  // Fetch total items count to determine if stash is truly empty
  const { data: statsData } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: statsApi.getDashboardStats,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Check if there are any items at all in the inventory (not just filtered results)
  const hasAnyItems = useMemo(() => (statsData?.totalItems ?? 0) > 0, [statsData]);
  const hasFilteredResults = useMemo(() => (data?.data?.length ?? 0) > 0, [data]);

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
    delete newFilters.priceFilter;

    if (filter === 'tags') newFilters.tag = subFilter;
    if (filter === 'location') newFilters.location = subFilter;
    if (filter === 'price' && subFilter) {
      newFilters.priceFilter = subFilter as 'priceless' | 'with-price' | 'no-price';
    }
    
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your Digital Stash
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Never lose track of your belongings again. Organize, search, and manage everything you own with powerful AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')} 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/')}
                className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 px-8 py-3 font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Camera className="h-8 w-8 text-purple-600" />,
                title: "Snap & Store",
                description: "Take photos of your items and let AI automatically categorize and tag them",
                features: ["Auto-tagging", "Smart categorization", "Location tracking"]
              },
              {
                icon: <Search className="h-8 w-8 text-blue-600" />,
                title: "Instant Search",
                description: "Find any item in seconds with powerful search and natural language queries",
                features: ["Natural language search", "Filter by location", "Tag-based filtering"]
              },
              {
                icon: <MapPin className="h-8 w-8 text-green-600" />,
                title: "Location Tracking",
                description: "Always know exactly where your items are stored with precise location mapping",
                features: ["Room-level precision", "Visual location maps", "Quick location updates"]
              }
            ].map((feature, index) => (
              <Card key={feature.title} className="border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">See it in action</h3>
                  <p className="text-gray-600 mb-6">
                    Discover how easy it is to organize your entire home with Stasher's intelligent item management system.
                  </p>
                  <div className="space-y-4">
                    {[
                      "📷 Snap photos of your items",
                      "🏷️ Auto-generate smart tags",
                      "📍 Track precise locations",
                      "🔍 Search with natural language",
                      "📊 View comprehensive statistics"
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Sample Items */}
                  {[
                    {
                      name: "MacBook Pro 16\"",
                      location: "Home Office → Desk Drawer",
                      tags: ["Electronics", "Work"],
                      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&h=120&fit=crop"
                    },
                    {
                      name: "Winter Coat",
                      location: "Bedroom Closet → Top Shelf",
                      tags: ["Clothing", "Winter"],
                      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=120&h=120&fit=crop"
                    },
                    {
                      name: "Camping Gear",
                      location: "Garage → Storage Box #3",
                      tags: ["Outdoor", "Sports"],
                      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=120&h=120&fit=crop"
                    }
                  ].map((item, index) => (
                    <Card key={item.name} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </div>
                            <div className="flex gap-1 mt-2">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get organized?</h3>
            <p className="text-gray-600 mb-8">Join thousands who've transformed their chaotic spaces into organized sanctuaries.</p>
            <Button 
              onClick={() => navigate('/')} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3"
            >
              Start Organizing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-screen-md lg:max-w-5xl mx-auto px-4 py-6">
        {!hasAnyItems && !isLoading && (
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
        
        {hasAnyItems && <StashStats />}
        
        
        <div className="space-y-6">
          <FilterSection 
            searchQuery={filters.search || ''}
            activeFilter={filters.tag ? 'tags' : filters.location ? 'location' : filters.priceFilter ? 'price' : 'all'}
            activeSubFilter={filters.tag || filters.location || filters.priceFilter}
            viewMode={viewMode}
            sortBy={filters.sort as SortOption}
            onSearchChange={handleSearch}
            onFilterChange={handleFilterChange}
            onViewChange={handleViewChange}
            onSortChange={handleSortChange}
            clearSubFilter={handleClearFilters}
            isLoading={isLoading}
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
          ) : data?.data && data.data.length === 0 && filters.search ? (
            // No results found with search - suggest Ask Stasher
            <Card className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No items found for "{filters.search}"</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try using our AI-powered Ask Stasher for natural language search like "Where are my winter clothes?" 
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => navigate('/ask')}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    <MessageSquareMore className="mr-2 h-4 w-4" />
                    Try Ask Stasher
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
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