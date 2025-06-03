
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
  Shield,
  Zap,
  Heart
} from "lucide-react";
import { useState } from "react";

const About = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
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
      icon: <Search className="h-6 w-6 text-indigo-600" />,
      title: "Smart Search & Filter",
      description: "Find items instantly using our powerful search. Filter by category, location, tags, or any custom criteria."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-indigo-600" />,
      title: "Photo Documentation",
      description: "Take high-quality photos of your items with automatic compression. Visual inventory makes finding things easier."
    },
    {
      icon: <Tag className="h-6 w-6 text-indigo-600" />,
      title: "Flexible Organization",
      description: "Create custom tags, categories, and locations. Organize your way with unlimited flexibility."
    },
    {
      icon: <MapPin className="h-6 w-6 text-indigo-600" />,
      title: "Location Tracking",
      description: "Never forget where you put something. Track exact locations down to specific rooms, boxes, or shelves."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
      title: "AI-Powered Assistant",
      description: "Ask questions in natural language: 'Where are my winter boots?' and get instant answers."
    },
    {
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      title: "Bulk Operations",
      description: "Import hundreds of items at once using CSV files. Perfect for large collections or moving."
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Add Items",
      content: "Click the '+' button to add new items to your inventory. Take photos, add descriptions, set locations, and categorize your belongings. You can add everything from electronics to seasonal decorations."
    },
    {
      step: "2", 
      title: "Search & Filter",
      content: "Use the search bar to quickly find items by name, description, or tags. Apply filters by category, location, or any custom criteria to narrow down your results instantly."
    },
    {
      step: "3",
      title: "Organize Smartly", 
      content: "Create custom locations like 'Garage Shelf 2' or 'Bedroom Closet Top'. Use tags for themes like 'Holiday', 'Electronics', or 'Important Documents' to group related items."
    },
    {
      step: "4",
      title: "Ask Stasher",
      content: "Can't remember where something is? Ask our AI assistant questions like 'Where did I put my passport?' or 'Show me all my holiday decorations' and get instant answers."
    },
    {
      step: "5",
      title: "Bulk Import",
      content: "Have many items to add? Use our bulk import feature to upload a spreadsheet with hundreds of items at once. Perfect for cataloging collections or when moving homes."
    },
    {
      step: "6",
      title: "Archive & History",
      content: "Archive items you no longer need without deleting them. Keep a complete history of your belongings and easily restore items if needed."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          About <span className="text-indigo-600">Stasher</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The smart way to organize, track, and find all your personal belongings. 
          Never lose track of your stuff again with our intelligent inventory system.
        </p>
      </div>

      {/* Mission Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600">
              We believe everyone deserves an organized life. Stasher was built to solve the universal problem 
              of forgetting where we put our belongings. From important documents to seasonal items, 
              we help you stay organized and stress-free.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How Stasher Works */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">How Stasher Works</h2>
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {howItWorksSteps.map((step, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <span className="text-lg font-medium">{step.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-4 pl-11">
                    <p className="text-gray-600 leading-relaxed">
                      {step.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Stasher */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Why Choose Stasher?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is encrypted and stored securely. We never share your personal inventory information.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Find any item in seconds with our optimized search engine and smart filtering system.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
              <p className="text-gray-600">Designed for mobile use. Add items on the go and access your inventory anywhere, anytime.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of users who have transformed how they manage their belongings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate("/my-stash")}
                  size="lg"
                  variant="secondary"
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  View My Stash
                </Button>
                <Button 
                  onClick={() => navigate("/add-item")}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-indigo-600"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogin}
                size="lg"
                variant="secondary"
                className="bg-white text-indigo-600 hover:bg-gray-100"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Creating account..." : "Get Started Free"}
                {!isLoggingIn && <User className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
