
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
  Share,
  ArrowRight,
  Star,
  Users,
  Globe,
  Shield
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
      icon: <Search className="h-8 w-8 text-white" />,
      title: "Smart Search",
      description: "Find your items instantly with powerful search and filtering capabilities.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-white" />,
      title: "Photo Inventory",
      description: "Take photos and add detailed descriptions to keep track of everything.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Share className="h-8 w-8 text-white" />,
      title: "Sharable Collections",
      description: "Create collections and share them with friends, family, or publicly.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Tag className="h-8 w-8 text-white" />,
      title: "Smart Tagging",
      description: "Organize with custom tags and categories for easy organization.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <MapPin className="h-8 w-8 text-white" />,
      title: "Location Tracking",
      description: "Remember exactly where you stored each item in your home.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      title: "AI Assistant",
      description: "Ask Stasher to help you find items using natural language.",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "10,000+", label: "Happy Users" },
    { icon: <Box className="h-6 w-6" />, value: "500K+", label: "Items Tracked" },
    { icon: <Globe className="h-6 w-6" />, value: "50+", label: "Countries" },
    { icon: <Star className="h-6 w-6" />, value: "4.9", label: "Rating" }
  ];

  // If user is logged in and has items, redirect to My Stash
  if (user && items.length > 0) {
    navigate("/my-stash");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ users worldwide</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Never Lose Track of
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">
              Your Belongings Again
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-4xl mx-auto px-4 leading-relaxed">
            Stasher helps you organize, track, and share all your personal items with ease. 
            From seasonal decorations to important documents, know exactly where everything is.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mb-12">
            {user ? (
              <Button 
                onClick={() => navigate("/add-item")}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Your First Item
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Creating account..." : "Get Started Free"}
                {!isLoggingIn && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            )}
            
            <Button 
              onClick={() => navigate("/about")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-white/60 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-2 text-indigo-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 px-4">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover effect gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mx-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="relative p-8 lg:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Ready to Get Organized?
              </h2>
              <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
                Join thousands of users who have transformed how they manage their belongings.
              </p>
              {user ? (
                <Button 
                  onClick={() => navigate("/add-item")}
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Start Adding Items
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleLogin}
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Creating account..." : "Sign Up Now"}
                  {!isLoggingIn && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
