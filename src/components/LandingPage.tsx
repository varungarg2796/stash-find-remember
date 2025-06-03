
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useItems } from "@/context/ItemsContext";
import { 
  PlusCircle, 
  User, 
  Search, 
  MessageSquare, 
  FileText, 
  Archive,
  Smartphone,
  Tag,
  MapPin,
  Share
} from "lucide-react";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { items } = useItems();
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

  const features = [
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      title: "Smart Search",
      description: "Find your items instantly with powerful search and filtering capabilities."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      title: "Photo Inventory",
      description: "Take photos and add detailed descriptions to keep track of everything."
    },
    {
      icon: <Share className="h-8 w-8 text-indigo-600" />,
      title: "Sharable Collections",
      description: "Create collections and share them with friends, family, or publicly."
    },
    {
      icon: <Tag className="h-8 w-8 text-indigo-600" />,
      title: "Smart Tagging",
      description: "Organize with custom tags and categories for easy organization."
    },
    {
      icon: <MapPin className="h-8 w-8 text-indigo-600" />,
      title: "Location Tracking",
      description: "Remember exactly where you stored each item in your home."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      title: "AI Assistant",
      description: "Ask Stasher to help you find items using natural language."
    }
  ];

  // If user is logged in and has items, redirect to My Stash
  if (user && items.length > 0) {
    navigate("/my-stash");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Never Lose Track of
            <span className="text-indigo-600 block">Your Belongings Again</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Stasher helps you organize, track, and share all your personal items with ease. 
            From seasonal decorations to important documents, know exactly where everything is.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {user ? (
              <Button 
                onClick={() => navigate("/add-item")}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Your First Item
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Creating account..." : "Get Started Free"}
                {!isLoggingIn && <User className="ml-2 h-5 w-5" />}
              </Button>
            )}
            <Button 
              onClick={() => navigate("/about")}
              variant="outline"
              size="lg"
              className="px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white mx-4">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Get Organized?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
              Join thousands of users who have transformed how they manage their belongings.
            </p>
            {user ? (
              <Button 
                onClick={() => navigate("/add-item")}
                size="lg"
                variant="secondary"
                className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-white text-indigo-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Start Adding Items
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
                size="lg"
                variant="secondary"
                className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-white text-indigo-600 hover:bg-gray-100 w-full sm:w-auto"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Creating account..." : "Sign Up Now"}
                {!isLoggingIn && <User className="ml-2 h-5 w-5" />}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
