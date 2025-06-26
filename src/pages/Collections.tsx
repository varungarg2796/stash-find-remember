import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FolderOpen, Loader2, Share2, Lock, Eye, Star, CheckCircle, ArrowRight, Grid3X3 } from 'lucide-react';
import CollectionCard from '@/components/collection/CollectionCard';
import CreateCollectionDialog from '@/components/collection/CreateCollectionDialog';
import {
  useCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation // We'll need this for inline editing
} from '@/hooks/useCollectionsQuery'; // Assuming you add update mutation
import { Collection } from '@/types';
import ErrorDisplay from '@/components/ErrorDisplay';

const Collections = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- DATA FETCHING & MUTATIONS ---
  // Only fetch collections if user is logged in
  const { data: collections, isLoading, error } = useCollectionsQuery(!!user);
  const createCollectionMutation = useCreateCollectionMutation();
  const deleteCollectionMutation = useDeleteCollectionMutation();
  
  // Note: You will need to create this hook and its corresponding API function
  const updateCollectionMutation = useUpdateCollectionMutation(); 


  // --- HANDLERS ---
  const handleCreateCollection = (name: string, description: string) => {
    createCollectionMutation.mutate({ name, description });
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This cannot be undone.')) {
      deleteCollectionMutation.mutate(id);
    }
  };

  const handleUpdateCollection = (collection: Collection) => {
    // The inline edit on the card will call this
    updateCollectionMutation.mutate(collection);
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Smart Collections
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Group your items into beautiful collections and share them with friends, family, or the world. Perfect for wishlists, inventories, and showcases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/')}
                className="border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-3 font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Grid3X3 className="h-8 w-8 text-blue-600" />,
                title: "Organize by Theme",
                description: "Create collections for any purpose - holiday decorations, kitchen gadgets, or hobby supplies",
                features: ["Custom categories", "Drag & drop organization", "Smart suggestions"]
              },
              {
                icon: <Share2 className="h-8 w-8 text-green-600" />,
                title: "Share with Anyone",
                description: "Make your collections public, share with family, or keep them private",
                features: ["Public/private sharing", "Password protection", "Custom permissions"]
              },
              {
                icon: <Eye className="h-8 w-8 text-purple-600" />,
                title: "Beautiful Showcases",
                description: "Display your collections as stunning visual galleries with customizable layouts",
                features: ["Visual gallery view", "Custom cover images", "Rich descriptions"]
              }
            ].map((feature) => (
              <Card key={feature.title} className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
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

          {/* Use Cases Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Perfect for Every Need</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "🎁 Holiday Gift Lists",
                  description: "Create shareable wishlists for birthdays, holidays, and special occasions",
                  items: ["Birthday wishlists", "Holiday gift guides", "Wedding registries", "Baby shower lists"]
                },
                {
                  title: "🏠 Home Inventory",
                  description: "Organize household items by room, category, or importance",
                  items: ["Kitchen essentials", "Seasonal decorations", "Important documents", "Emergency supplies"]
                },
                {
                  title: "💼 Professional Collections",
                  description: "Showcase portfolios, inventories, and professional assets",
                  items: ["Art portfolios", "Tool inventories", "Equipment catalogs", "Product showcases"]
                },
                {
                  title: "🎨 Hobby & Passion Projects",
                  description: "Track collections, projects, and hobby-related items",
                  items: ["Collectible items", "Craft supplies", "Reading lists", "Travel gear"]
                }
              ].map((useCase, index) => (
                <Card key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h4>
                    <p className="text-gray-600 mb-4">{useCase.description}</p>
                    <div className="space-y-2">
                      {useCase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Demo Collections */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Example Collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Kitchen Essentials",
                    itemCount: 24,
                    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
                    isPublic: true,
                    description: "Must-have tools for any home chef"
                  },
                  {
                    title: "Holiday Decorations",
                    itemCount: 18,
                    coverImage: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300&h=200&fit=crop",
                    isPublic: false,
                    description: "Christmas lights, ornaments, and more"
                  },
                  {
                    title: "Camping Gear",
                    itemCount: 31,
                    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop",
                    isPublic: true,
                    description: "Everything needed for outdoor adventures"
                  }
                ].map((collection, index) => (
                  <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={collection.coverImage}
                        alt={collection.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {collection.isPublic ? (
                          <Badge className="bg-green-100 text-green-700">
                            <Eye className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-900 mb-2">{collection.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{collection.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{collection.itemCount} items</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">Featured</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to create your first collection?</h3>
            <p className="text-gray-600 mb-8">Start organizing and sharing your items with beautiful, customizable collections.</p>
            <Button 
              onClick={() => navigate('/')} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3"
            >
              Create Your First Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <ErrorDisplay title="Could not load collections" message={error.message} />;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Collections</h1>
          </div>
        </div>
        <CreateCollectionDialog onCreateCollection={handleCreateCollection} />
      </div>

      {(collections?.length ?? 0) === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FolderOpen className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No Collections Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first collection to group and share your items.
            </p>
            <CreateCollectionDialog onCreateCollection={handleCreateCollection} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections?.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              // Pass the mutation handlers to the card for inline actions
              onEdit={handleUpdateCollection}
              onDelete={handleDeleteCollection}
              onNavigate={(id) => navigate(`/collections/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;