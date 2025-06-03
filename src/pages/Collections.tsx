import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCollections } from "@/context/CollectionsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Share, Edit, Trash2, Users, Globe, Heart, Sparkles } from "lucide-react";

const Collections = () => {
  const { user, login } = useAuth();
  const { collections, addCollection, deleteCollection } = useCollections();
  const navigate = useNavigate();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleQuickLogin = () => {
    login({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=user-1"
    });
  };

  // Show placeholder content for non-logged-in users
  if (!user) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6">
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

        <Card className="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 border-none">
          <CardContent className="p-8">
            <div className="text-center">
              <Share className="mx-auto h-16 w-16 text-purple-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Share Your Passions with the World</h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Create beautiful collections of your favorite items and share them with friends, family, or the entire community. 
                Discover amazing collections from other passionate collectors!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Curated Lists</h3>
                  <p className="text-sm text-gray-600">Organize items by theme or passion</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Share & Discover</h3>
                  <p className="text-sm text-gray-600">Connect with like-minded collectors</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Public or Private</h3>
                  <p className="text-sm text-gray-600">Choose your privacy settings</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Beautiful Layouts</h3>
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

        {/* Example collections to show what's possible */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Example Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{collection.title}</span>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {collection.items} items
                    </span>
                    <div className="flex items-center gap-1">
                      {collection.isPublic && (
                        <Share className="h-3 w-3 text-green-600" />
                      )}
                      <span className={collection.isPublic ? "text-green-600" : "text-gray-500"}>
                        {collection.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addCollection({
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || undefined,
        items: []
      });
      setNewCollectionName("");
      setNewCollectionDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      deleteCollection(id);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-3xl font-bold">My Collections</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Collection Name</label>
                <Input
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., My Sneaker Collection"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Brief description of your collection..."
                  maxLength={200}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                  Create Collection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Share className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first collection to group and share your items with others.
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Collection Name</label>
                    <Input
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="e.g., My Sneaker Collection"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      placeholder="Brief description of your collection..."
                      maxLength={200}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                      Create Collection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{collection.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/collections/${collection.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCollection(collection.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {collection.items.length} item{collection.items.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    {collection.shareSettings.isEnabled && (
                      <Share className="h-3 w-3 text-green-600" />
                    )}
                    <span className={collection.shareSettings.isEnabled ? "text-green-600" : "text-muted-foreground"}>
                      {collection.shareSettings.isEnabled ? "Shared" : "Private"}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-3" 
                  variant="outline"
                  onClick={() => navigate(`/collections/${collection.id}`)}
                >
                  View Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
