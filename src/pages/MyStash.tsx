
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/AddItemButton";
import FilterSection from "@/components/filter/FilterSection";
import ItemsDisplay from "@/components/items/ItemsDisplay";
import StashStats from "@/components/StashStats";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import { useItemFiltering } from "@/hooks/useItemFiltering";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useItems } from "@/context/ItemsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, Camera, MapPin, Tag, Star } from "lucide-react";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { useState, useEffect } from "react";

const MyStash = () => {
  const { navigateWithState } = useNavigationHelper();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { items } = useItems();
  const [isLoading, setIsLoading] = useState(true);
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

  const hasItems = items.length > 0;
  const itemsPerPage = 12;

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickLogin = () => {
    login({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=user-1"
    });
  };

  const handleAddItem = () => {
    navigateWithState("/add-item", "/my-stash");
  };

  const handleClearFilters = () => {
    handleSearch("");
    handleFilterChange("all");
  };

  // Show placeholder content for non-logged-in users
  if (!user) {
    return (
      <TooltipProvider>
        <div className="max-w-screen-md mx-auto px-4 py-6 animate-fade-in-up">
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
            <CardContent className="p-8">
              <div className="text-center">
                <Package className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Personal Stash Awaits!</h2>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Imagine having all your belongings organized, searchable, and always at your fingertips. 
                  Join thousands who never lose track of their stuff again!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Camera className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Photo Inventory</h3>
                    <p className="text-sm text-gray-600">Snap photos and add descriptions</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Location Tracking</h3>
                    <p className="text-sm text-gray-600">Remember where everything is stored</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Tag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Smart Organization</h3>
                    <p className="text-sm text-gray-600">Tags and categories that make sense</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={handleQuickLogin}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg w-full sm:w-auto"
                  >
                    Start Organizing for Free
                    <Star className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-gray-500">
                    ✨ No credit card required • ✨ Setup in 30 seconds
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview of what the interface looks like */}
          <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview: Your Stash Interface</h3>
                <p className="text-sm text-gray-500">This is what your organized collection will look like</p>
              </div>
              <div className="space-y-4 opacity-60">
                <div className="flex gap-2">
                  <div className="bg-white p-2 rounded border flex-1">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                  </div>
                  <div className="bg-white p-2 rounded border flex-1">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-screen-md mx-auto px-4 py-6 animate-fade-in-up">
        {/* Welcome card for first-time users */}
        {!hasItems && !isLoading && (
          <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-none animate-scale-in">
            <CardContent className="p-6">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">Let's add your first item! 🚀</h2>
                <p className="mt-2 text-gray-600">
                  Your stash is empty. Start by adding your first item to begin organizing your collection.
                </p>
                <div className="mt-4">
                  <Button 
                    onClick={handleAddItem}
                    variant="default" 
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats - Only show when there are items */}
        {hasItems && !isLoading && <StashStats />}
        
        {/* Main content section with improved spacing and organization */}
        <div className="space-y-6">
          {/* Search and filters section */}
          {!isLoading && (
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
          )}
          
          {/* Loading skeletons or items display */}
          {isLoading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <ItemCardSkeleton key={index} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <ItemsDisplay 
              items={filteredItems}
              viewMode={viewMode}
              enablePagination={true}
              itemsPerPage={itemsPerPage}
              searchQuery={searchQuery}
              activeFilter={activeFilter}
              onClearFilters={handleClearFilters}
              onAddItem={handleAddItem}
            />
          )}
        </div>
        
        {/* Fixed action button */}
        {!isLoading && <AddItemButton onClick={handleAddItem} />}
      </div>
    </TooltipProvider>
  );
};

export default MyStash;
