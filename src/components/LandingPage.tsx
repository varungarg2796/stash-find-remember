import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  Search,
  ArrowRight,
  Box,
  Sparkles,
  FolderOpen,
  Settings,
  ChevronRight,
  Loader2,
  ArrowDown,
  Star,
  Shield,
  Zap,
  Camera,
  MessageSquare,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Play,
  Eye,
  Tag,
  BarChart3,
  Globe,
  FileText,
  Share
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '@/services/api/itemsApi';
import { collectionsApi } from '@/services/api/collectionsApi';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Demo data
  const demoItems = [
    {
      id: 1,
      name: "MacBook Pro 16\"",
      location: "Home Office → Desk Drawer",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&h=120&fit=crop",
      tags: ["Electronics", "Work"],
      value: "$2,400"
    },
    {
      id: 2,
      name: "Blue Winter Coat",
      location: "Bedroom Closet → Top Shelf", 
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=120&h=120&fit=crop",
      tags: ["Clothing", "Winter"]
    },
    {
      id: 3,
      name: "Camping Gear Set",
      location: "Garage → Storage Box #3",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=120&h=120&fit=crop",
      tags: ["Outdoor", "Sports"]
    }
  ];

  const searchQueries = [
    "Where is my blue winter coat?",
    "Show me all electronics",
    "Find my camping gear"
  ];

  const stats = [
    { number: "50K+", label: "Items Tracked", icon: <Box className="h-4 w-4" /> },
    { number: "5K+", label: "Happy Users", icon: <Users className="h-4 w-4" /> },
    { number: "99.2%", label: "Success Rate", icon: <BarChart3 className="h-4 w-4" /> }
  ];

  // Fetch data only when user is logged in
  const { data: itemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: ['landingPageItems'],
    queryFn: () => itemsApi.getAll({ limit: 1 }),
    enabled: !!user,
  });

  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['landingPageCollections'],
    queryFn: () => collectionsApi.getAll(),
    enabled: !!user,
  });

  // Animated search demo
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setShowSearchResult(false);
      setSearchQuery("");

      const query = searchQueries[currentSearchIndex];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < query.length) {
          setSearchQuery(query.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          
          setTimeout(() => {
            setShowSearchResult(true);
          }, 800);

          setTimeout(() => {
            setCurrentSearchIndex((prev) => (prev + 1) % searchQueries.length);
          }, 4000);
        }
      }, 80);

      return () => clearInterval(typeInterval);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSearchIndex]);

  const handleLogin = () => {
    setIsLoggingIn(true);
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const isLoading = isLoadingItems || isLoadingCollections;
  const itemCount = itemsData?.data?.length ?? 0;
  const collectionCount = collectionsData?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-12">
            
            {/* Main Headline */}
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
                Never lose
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% font-extrabold">
                  anything again
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Snap, organize, and find your belongings instantly with AI-powered smart search.
                <br className="hidden sm:block" />
                <span className="text-purple-600 font-medium">Turn chaos into control.</span>
              </p>
            </div>

            {/* Interactive Search Demo */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
                  <Input
                    value={searchQuery}
                    readOnly
                    placeholder="Ask StashTracker anything..."
                    className="pl-12 h-16 text-lg bg-white shadow-2xl border-2 border-transparent focus:border-purple-400 rounded-xl text-center font-medium"
                  />
                  {isTyping && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-1 h-8 bg-purple-600 animate-pulse rounded"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Search Result */}
              {showSearchResult && (
                <div className="animate-scale-in">
                  <Card className="bg-white shadow-2xl border-purple-200 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-purple-800">Found it instantly!</span>
                        <div className="ml-auto flex items-center text-sm text-green-600">
                          <Clock className="h-4 w-4 mr-1" />
                          0.2s
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <img 
                          src={demoItems[currentSearchIndex]?.image}
                          alt="Found item"
                          className="w-16 h-16 rounded-lg object-cover shadow-md"
                        />
                        <div className="flex-1 text-left">
                          <h3 className="font-bold text-gray-900 text-lg">{demoItems[currentSearchIndex]?.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{demoItems[currentSearchIndex]?.location}</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            {demoItems[currentSearchIndex]?.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs font-medium">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              {user ? (
                <>
                  <Button 
                    onClick={() => navigate('/add-item')} 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
                  >
                    <Camera className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" /> 
                    Add First Item
                  </Button>
                  <Button 
                    onClick={() => navigate('/my-stash')} 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 px-10 py-6 text-lg rounded-xl font-semibold hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  >
                    <Box className="mr-3 h-5 w-5" /> 
                    View Stash
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleLogin} 
                    size="lg" 
                    disabled={isLoggingIn}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-12 py-6 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Setting up your stash...
                      </>
                    ) : (
                      <>
                        Start Organizing Free
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 px-10 py-6 text-lg rounded-xl font-semibold hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
                  >
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See it in action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform chaos into organized bliss
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Camera className="h-16 w-16 text-purple-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">Snap & Store</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Take photos, add locations, and let our AI automatically tag and categorize everything for you.
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                <img 
                  src="/image2.jpeg" 
                  alt="Person organizing items"
                  className="w-full h-40 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Sparkles className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-green-600 transition-colors">AI Organizes</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Smart collections, automatic tagging, and intelligent categorization. No manual work required.
              </p>
              <div className="space-y-3">
                {[
                  { name: "Electronics", count: 12, color: "bg-blue-500" },
                  { name: "Clothing", count: 28, color: "bg-purple-500" },
                  { name: "Documents", count: 15, color: "bg-green-500" }
                ].map((collection, index) => (
                  <div 
                    key={collection.name}
                    className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${collection.color}`}></div>
                      <span className="font-medium">{collection.name}</span>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {collection.count} items
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Search className="h-16 w-16 text-orange-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-600 transition-colors">Find Instantly</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ask in natural language and get instant results with photos, locations, and smart suggestions.
              </p>
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-left">
                      <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                        <p className="text-sm font-medium text-orange-700 italic">
                          "Where are my running shoes?"
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-3">
                        <p className="text-sm font-medium">
                          Found in Hallway Closet → Bottom Shelf
                        </p>
                        <div className="flex items-center justify-center mt-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Live Demo Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            
            {/* Items Showcase */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Box className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-bold">Your organized stash</h3>
              </div>
              <div className="space-y-4">
                {demoItems.map((item, index) => (
                  <Card 
                    key={item.id}
                    className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-200"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover shadow-lg"
                          />
                          {item.value && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {item.value}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h4>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{item.location}</span>
                          </div>
                          <div className="flex gap-2">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs font-medium bg-purple-100 text-purple-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Chat Interface */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-purple-600" />
                <h3 className="text-2xl font-bold">Ask StashTracker</h3>
              </div>
              <Card className="h-96 flex flex-col shadow-2xl border-2 border-purple-100">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 space-y-4 overflow-hidden">
                  
                  {/* Chat messages */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
                          <p className="text-sm">Where did I put my camping gear?</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl rounded-tl-sm p-4 border border-purple-200">
                          <p className="text-sm mb-3 font-medium">
                            I found your camping gear in <strong>Garage → Storage Box #3</strong>
                          </p>
                          <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                            <img 
                              src={demoItems[2].image}
                              alt="Camping gear"
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-xs font-semibold">Camping Gear Set</p>
                              <p className="text-xs text-gray-500">Added 3 weeks ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
                          <p className="text-sm">Show me all my valuable items</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl rounded-tl-sm p-4 border border-purple-200">
                          <p className="text-sm mb-2 font-medium">Found 3 valuable items:</p>
                          <div className="space-y-1">
                            <div className="text-xs bg-white rounded-lg p-2 shadow-sm">💻 MacBook Pro - $2,400</div>
                            <div className="text-xs bg-white rounded-lg p-2 shadow-sm">💍 Grandmother's Ring - Priceless</div>
                            <div className="text-xs bg-white rounded-lg p-2 shadow-sm">📷 Vintage Camera - $800</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why StashTracker works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for real people with real organizational challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-yellow-600" />,
                title: "Lightning Fast",
                description: "Find any item in under 2 seconds with AI-powered search",
                bg: "from-yellow-50 to-orange-50",
                border: "border-yellow-200"
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: "Privacy First",
                description: "Your data stays secure and private, always encrypted",
                bg: "from-green-50 to-emerald-50", 
                border: "border-green-200"
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                title: "Save Hours",
                description: "Stop wasting time searching. Get your life back",
                bg: "from-blue-50 to-cyan-50",
                border: "border-blue-200"
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600" />,
                title: "Family Sharing",
                description: "Share collections and track items together as a family",
                bg: "from-purple-50 to-pink-50",
                border: "border-purple-200"
              }
            ].map((feature, index) => (
              <Card 
                key={feature.title} 
                className={`text-center border-2 ${feature.border} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <blockquote className="text-2xl sm:text-3xl font-light text-white leading-relaxed">
              "StashTracker saved my sanity. I used to spend hours looking for things. Now I find everything in seconds."
            </blockquote>
            <div className="text-purple-200">
              <p className="font-semibold">Sarah Chen</p>
              <p className="text-sm">Busy Mom of 3, San Francisco</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to get organized?
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Join thousands who've transformed their chaotic spaces into organized sanctuaries
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
              <Button 
                size="lg"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="bg-white text-purple-900 hover:bg-gray-100 font-bold px-10 py-6 text-lg rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Camera className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Start Free Today
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-10 py-6 text-lg rounded-xl font-bold hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                <Eye className="mr-3 h-5 w-5" />
                View Pricing
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>2-minute setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Dashboard Preview (when logged in) */}
      {user && (
        <div className="mt-16 space-y-8 animate-fade-in">
          <div className="max-w-4xl mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="text-lg font-medium">Loading your stash...</span>
                </div>
              </div>
            ) : (
              <>
                <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-center shadow-2xl">
                  <CardContent className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Welcome to StashTracker, {user.name?.split(' ')[0]}! 🎉
                      </h2>
                      <p className="text-lg text-gray-600 mb-6">
                        {itemCount > 0 
                          ? `You have ${itemCount} item(s) organized. Ready to add more?`
                          : "Your organized life starts now. Let's add your first item!"
                        }
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <Button 
                        onClick={() => navigate('/add-item')} 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg w-full sm:w-auto"
                      >
                        <Camera className="mr-2 h-5 w-5" />
                        Add First Item
                      </Button>
                      <Button 
                        onClick={() => navigate('/ask')} 
                        variant="outline"
                        className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                      >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Try AI Search
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "My Stash",
                      description: `${itemCount} items organized`,
                      icon: <Box className="h-6 w-6" />,
                      path: "/my-stash",
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      title: "Collections",
                      description: `${collectionCount} collections created`,
                      icon: <FolderOpen className="h-6 w-6" />,
                      path: "/collections", 
                      color: "from-green-500 to-emerald-500"
                    },
                    {
                      title: "Ask AI",
                      description: "AI-powered smart search",
                      icon: <MessageSquare className="h-6 w-6" />,
                      path: "/ask",
                      color: "from-purple-500 to-pink-500"
                    }
                  ].map((item, index) => (
                    <Card 
                      key={item.title}
                      className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 group border-2 border-transparent hover:border-purple-200"
                      onClick={() => navigate(item.path)}
                      style={{ 
                        animationDelay: `${index * 150}ms`,
                        animation: 'slideInUp 0.6s ease-out forwards'
                      }}
                    >
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between text-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                              {item.icon}
                            </div>
                            <span className="group-hover:text-purple-600 transition-colors">{item.title}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-gray-400" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 font-medium">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {itemCount === 0 && (
                  <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-amber-900 mb-3">Quick Setup</h3>
                      <p className="text-amber-700 mb-6 text-lg">
                        Let's configure your profile to get the most out of StashTracker
                      </p>
                      <Button 
                        onClick={() => navigate('/profile')} 
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 text-lg"
                      >
                        <Settings className="mr-2 h-5 w-5" /> 
                        Complete Setup
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;