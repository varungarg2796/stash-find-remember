
import { useNavigate } from "react-router-dom";
import AddItemButton from "@/components/AddItemButton";
import FilterSection from "@/components/filter/FilterSection";
import ItemsDisplay from "@/components/items/ItemsDisplay";
import StashStats from "@/components/StashStats";
import { useItemFiltering } from "@/hooks/useItemFiltering";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, User } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
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
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-none">
          <CardContent className="p-6">
            {user ? (
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h2>
                <p className="mt-2 text-gray-600">
                  Ready to organize your items? Your personal stash is waiting for you.
                </p>
                <div className="mt-4">
                  <Button 
                    onClick={() => navigate("/add-item")}
                    variant="default" 
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Item
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

        <StashStats />
        
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
        
        <ItemsDisplay 
          items={filteredItems}
          viewMode={viewMode}
        />
        
        <AddItemButton onClick={() => navigate("/add-item")} />
      </div>
    </TooltipProvider>
  );
};

export default Index;
