
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useItems } from "@/context/ItemsContext";
import { useCollections } from "@/context/CollectionsContext";
import { 
  PlusCircle, 
  Search, 
  ArrowRight,
  Box,
  Sparkles,
  FolderOpen,
  Settings,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { items } = useItems();
  const { collections } = useCollections();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
              Organize with
              <span className="block font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simplicity
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Keep track of your belongings in the most elegant way possible.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate("/add-item")}
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                <Button 
                  onClick={() => navigate("/my-stash")}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  <Box className="mr-2 h-4 w-4" />
                  My Stash
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Getting started..." : "Get Started"}
                {!isLoggingIn && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>

          {/* Features - Minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-16">
            <Card className="bg-white/50 border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Smart Search</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Find anything instantly with intelligent search.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Effortless</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Designed to be intuitive and beautiful.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User-specific content when logged in */}
          {user && (
            <div className="mt-16 space-y-6">
              {/* Welcome message */}
              <div className="p-6 bg-white/60 rounded-2xl border border-gray-200 max-w-lg mx-auto">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome back, {user.name.split(' ')[0]}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {items.length > 0 
                    ? `You have ${items.length} item${items.length === 1 ? '' : 's'} in your stash.`
                    : "Ready to add your first item?"
                  }
                </p>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-blue-200 bg-blue-50/50"
                  onClick={() => navigate("/my-stash")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg text-blue-900">
                      <div className="flex items-center gap-2">
                        <Box className="h-5 w-5" />
                        <span>My Stash</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-blue-700 mb-2">
                      {items.length} items organized
                    </p>
                    <p className="text-xs text-blue-600">
                      View and manage your inventory
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-purple-200 bg-purple-50/50"
                  onClick={() => navigate("/collections")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg text-purple-900">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        <span>My Collections</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-purple-700 mb-2">
                      {collections.length} collections created
                    </p>
                    <p className="text-xs text-purple-600">
                      Curate and share themed groups
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-green-200 bg-green-50/50"
                  onClick={() => navigate("/profile")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg text-green-900">
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-green-700 mb-2">
                      Configure preferences
                    </p>
                    <p className="text-xs text-green-600">
                      Customize your experience
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Configuration Recommendation */}
              {items.length === 0 && (
                <Card className="max-w-lg mx-auto border border-amber-200 bg-amber-50/50">
                  <CardContent className="p-6 text-center">
                    <Settings className="mx-auto h-8 w-8 text-amber-600 mb-3" />
                    <h3 className="font-medium text-amber-900 mb-2">Configure Your Stash</h3>
                    <p className="text-sm text-amber-700 mb-4">
                      Set up your profile and preferences to get the most out of Stasher.
                    </p>
                    <Button 
                      onClick={() => navigate("/profile")}
                      variant="outline"
                      size="sm"
                      className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      <Settings className="mr-2 h-3 w-3" />
                      Go to Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
