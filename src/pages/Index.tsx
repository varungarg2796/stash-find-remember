
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/AddItemButton";
import FilterSection from "@/components/filter/FilterSection";
import ItemsDisplay from "@/components/items/ItemsDisplay";
import StashStats from "@/components/StashStats";
import { useItemFiltering } from "@/hooks/useItemFiltering";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useItems } from "@/context/ItemsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Search } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { items } = useItems();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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

  const handleLogin = () => {
    setIsLoggingIn(true);
    // Simulate login process
    setTimeout(() => {
      login({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=user-1"
      });
      setIsLoggingIn(false);
    }, 800);
  };

  return (
    <TooltipProvider>
      <div className="max-w-screen-md mx-auto px-4 py-6">
        {/* Welcome card - only show welcome message when no items or not logged in */}
        {(!user || !hasItems) && (
          <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-none">
            <CardContent className="p-6">
              {user ? (
                // Show this only when user is logged in but has no items
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-800">Let's add your first item! 🚀</h2>
                  <p className="mt-2 text-gray-600">
                    Your stash is empty. Start by adding your first item to begin organizing your collection.
                  </p>
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate("/add-item")}
                      variant="default" 
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome to Stasher! 👋</h2>
                  <p className="mt-2 text-gray-600">
                    Keep track of everything you own in one place. Start by creating an account to organize your personal inventory.
                  </p>
                  <div className="mt-4">
                    <Button 
                      onClick={handleLogin} 
                      variant="default" 
                      className="bg-indigo-600 hover:bg-indigo-700"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? "Creating account..." : "Create Account"}
                      {!isLoggingIn && <User className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats - Only show when there are items */}
        {hasItems && <StashStats />}
        
        {/* Main content section with improved spacing and organization */}
        <div className="space-y-6">
          {/* Search and filters section */}
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
          
          {/* Items display section */}
          <ItemsDisplay 
            items={filteredItems}
            viewMode={viewMode}
          />
        </div>
        
        {/* Fixed action button */}
        <AddItemButton onClick={() => navigate("/add-item")} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
