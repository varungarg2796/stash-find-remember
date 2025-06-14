import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCollections } from "@/context/CollectionsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Globe, Heart, Sparkles, FolderOpen } from "lucide-react";
import CollectionCard from "@/components/collection/CollectionCard";
import CreateCollectionDialog from "@/components/collection/CreateCollectionDialog";

const Collections = () => {
  const { user, login } = useAuth();
  const { collections, addCollection, deleteCollection, updateCollection } = useCollections();
  const navigate = useNavigate();

  const handleQuickLogin = () => {
    login({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      avatarUrl: "https://i.pravatar.cc/150?u=user-1"
    });
  };

  const handleCreateCollection = (name: string, description: string) => {
    addCollection({
      name,
      description: description || undefined,
      items: []
    });
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      deleteCollection(id);
    }
  };

  // Show placeholder content for non-logged-in users
  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-3xl font-bold">Collections</h1>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-violet-50 to-purple-50 border-none">
          <CardContent className="p-8">
            <div className="text-center">
              <FolderOpen className="mx-auto h-16 w-16 text-purple-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Curate & Share Your Collections</h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Create beautiful collections of your favorite items and share them with friends, family, or the entire community. 
                Discover amazing collections from other passionate collectors!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Heart className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Curated Lists</h3>
                  <p className="text-sm text-gray-600">Organize items by theme or passion</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Users className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Share & Discover</h3>
                  <p className="text-sm text-gray-600">Connect with like-minded collectors</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Globe className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Public or Private</h3>
                  <p className="text-sm text-gray-600">Choose your privacy settings</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Sparkles className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-lg">Beautiful Layouts</h3>
                  <p className="text-sm text-gray-600">Showcase items in style</p>
                </div>
              </div>

              <Button 
                onClick={handleQuickLogin}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg mb-4"
              >
                Start Creating Collections
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">
                Join thousands of collectors sharing their passion
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Example collections */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700">Example Collections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Vintage Camera Collection",
                description: "A curated selection of classic film cameras from the 60s-90s",
                items: 24,
                isPublic: true,
                theme: "bg-gradient-to-br from-amber-50 to-orange-100"
              },
              {
                title: "My Sneaker Archive",
                description: "Limited edition and rare sneakers collected over the years",
                items: 18,
                isPublic: false,
                theme: "bg-gradient-to-br from-blue-50 to-indigo-100"
              },
              {
                title: "Board Game Library",
                description: "Strategy games, party games, and hidden gems for every occasion",
                items: 47,
                isPublic: true,
                theme: "bg-gradient-to-br from-green-50 to-emerald-100"
              }
            ].map((collection, index) => (
              <Card key={index} className={`${collection.theme} border-dashed border-2 border-gray-300 opacity-75`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span className="truncate">{collection.title}</span>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500 font-medium">
                      {collection.items} items
                    </span>
                    <div className="flex items-center gap-1">
                      {collection.isPublic && (
                        <Share className="h-3 w-3 text-green-600" />
                      )}
                      <span className={collection.isPublic ? "text-green-600 font-medium" : "text-gray-500"}>
                        {collection.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Collections</h1>
          </div>
        </div>
        
        <CreateCollectionDialog 
          onCreateCollection={handleCreateCollection}
          triggerClassName="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        />
      </div>

      {collections.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FolderOpen className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No Collections Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first collection to group and share your items with others. Collections help you organize items by themes, occasions, or any way you like.
            </p>
            <CreateCollectionDialog 
              onCreateCollection={handleCreateCollection}
              triggerClassName="bg-purple-600 hover:bg-purple-700"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={updateCollection}
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
