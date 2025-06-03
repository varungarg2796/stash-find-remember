
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Smartphone, 
  Tag, 
  MapPin, 
  MessageSquare, 
  FileText,
  Share,
  Shield,
  Clock,
  Users
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center mb-6 sm:mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">About Stasher</h1>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Mission Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Stasher is designed to help you take control of your belongings and never lose track of what you own. 
              Whether you're organizing your home, managing collections, or sharing items with others, 
              Stasher provides the tools you need to stay organized in our increasingly complex world.
            </p>
          </CardContent>
        </Card>

        {/* How Stasher Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">How Stasher Works</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-indigo-600" />
                    1. Add Your Items
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p>Start by adding items to your digital inventory:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Take photos or choose icons for visual identification</li>
                      <li>Add detailed descriptions and notes</li>
                      <li>Set quantities and track values</li>
                      <li>Assign locations where items are stored</li>
                      <li>Add custom tags for easy categorization</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-indigo-600" />
                    2. Organize & Categorize
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p>Use our powerful organization tools:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Create custom tags and categories</li>
                      <li>Set up locations throughout your home</li>
                      <li>Filter items by type, location, or value</li>
                      <li>Sort by date added, name, or custom criteria</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Share className="h-5 w-5 mr-2 text-indigo-600" />
                    3. Create Collections & Share
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p>Group items into collections and share them with others:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Create themed collections (e.g., "Books to Lend", "Vintage Cameras")</li>
                      <li>Generate shareable links for any collection</li>
                      <li>Control what information is visible to viewers</li>
                      <li>Set password protection or make collections public</li>
                      <li>Allow others to comment or contact you about items</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-indigo-600" />
                    4. Search & Find
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p>Quickly locate any item in your inventory:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Use the smart search to find items by name, description, or tags</li>
                      <li>Ask our AI assistant using natural language</li>
                      <li>Filter by location to find items in specific rooms</li>
                      <li>Browse by categories and tags</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Search className="h-6 w-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Smart Search</h3>
                    <p className="text-sm text-muted-foreground">Find anything instantly with powerful search and filtering.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Share className="h-6 w-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Sharable Collections</h3>
                    <p className="text-sm text-muted-foreground">Create and share collections with customizable privacy settings.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-6 w-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">Ask questions in natural language to find your items.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Location Tracking</h3>
                    <p className="text-sm text-muted-foreground">Remember exactly where you stored each item.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Bulk Import</h3>
                    <p className="text-sm text-muted-foreground">Import multiple items at once using spreadsheets.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-6 w-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Photo Inventory</h3>
                    <p className="text-sm text-muted-foreground">Visual organization with photos and custom icons.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection Sharing Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Collection Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Create themed collections and share them with others for various purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Showcase Collections</h4>
                      <p className="text-sm text-muted-foreground">Share your prized possessions with friends and family.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Insurance Documentation</h4>
                      <p className="text-sm text-muted-foreground">Securely share inventories with insurance providers.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Trading & Selling</h4>
                      <p className="text-sm text-muted-foreground">Create collections of items you want to trade or sell.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Lending Libraries</h4>
                      <p className="text-sm text-muted-foreground">Share what you're willing to lend to others.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-none">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-4 sm:mb-6">
              Start organizing your belongings today and never lose track of your items again.
            </p>
            <Button 
              onClick={() => navigate("/")}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
            >
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
