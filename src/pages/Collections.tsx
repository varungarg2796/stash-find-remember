
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCollections } from "@/context/CollectionsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Share, Edit, Trash2, Users, Globe, Heart, Sparkles, FolderOpen, Archive } from "lucide-react";

const Collections = () => {
  const { user, login } = useAuth();
  const { collections, addCollection, deleteCollection, updateCollection } = useCollections();
  const navigate = useNavigate();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleQuickLogin = () => {
    login({
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      avatarUrl: "https://i.pravatar.cc/150?u=user-1"
    });
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

        {/* Example collections to show what's possible */}
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
              <Card key={index} className={`${collection.theme} border-dashed border-2 border-gray-300 opacity-75 hover:opacity-90 transition-opacity`}>
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

  const handleEditCollection = (collection: any) => {
    setEditingCollection(collection.id);
    setEditName(collection.name);
    setEditDescription(collection.description || "");
  };

  const handleSaveEdit = () => {
    if (editingCollection && editName.trim()) {
      const collection = collections.find(c => c.id === editingCollection);
      if (collection) {
        updateCollection({
          ...collection,
          name: editName.trim(),
          description: editDescription.trim() || undefined
        });
      }
      setEditingCollection(null);
      setEditName("");
      setEditDescription("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
    setEditName("");
    setEditDescription("");
  };

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
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4">
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
        <Card className="text-center py-16">
          <CardContent>
            <FolderOpen className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No Collections Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first collection to group and share your items with others. Collections help you organize items by themes, occasions, or any way you like.
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  {editingCollection === collection.id ? (
                    <div className="w-full space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-sm"
                        maxLength={50}
                      />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="text-sm"
                        maxLength={200}
                        rows={2}
                      />
                      <div className="flex gap-1">
                        <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="truncate pr-2">{collection.name}</span>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCollection(collection)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              {editingCollection !== collection.id && (
                <CardContent className="pt-0">
                  {collection.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground font-medium">
                      {collection.items.length} item{collection.items.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-1">
                      {collection.shareSettings.isEnabled && (
                        <Share className="h-3 w-3 text-green-600" />
                      )}
                      <span className={collection.shareSettings.isEnabled ? "text-green-600 font-medium" : "text-muted-foreground"}>
                        {collection.shareSettings.isEnabled ? "Shared" : "Private"}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate(`/collections/${collection.id}`)}
                  >
                    View Collection
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
