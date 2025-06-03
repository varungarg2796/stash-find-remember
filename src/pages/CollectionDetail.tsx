
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCollections } from "@/context/CollectionsContext";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Share, Copy, Eye, Settings } from "lucide-react";
import { toast } from "sonner";

const CollectionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getCollection, updateCollection, addItemToCollection, removeItemFromCollection, updateShareSettings } = useCollections();
  const { items } = useItems();
  const navigate = useNavigate();
  
  const [collection, setCollection] = useState(getCollection(id!));
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(collection?.name || "");
  const [editDescription, setEditDescription] = useState(collection?.description || "");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareSettings, setShareSettings] = useState(collection?.shareSettings);

  useEffect(() => {
    const updatedCollection = getCollection(id!);
    setCollection(updatedCollection);
    setShareSettings(updatedCollection?.shareSettings);
  }, [id, getCollection]);

  if (!user) {
    navigate("/");
    return null;
  }

  if (!collection) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
          <Button onClick={() => navigate("/collections")}>Back to Collections</Button>
        </div>
      </div>
    );
  }

  const collectionItems = collection.items.map(collectionItem => {
    const item = items.find(i => i.id === collectionItem.itemId);
    return item ? { ...item, collectionNote: collectionItem.collectionNote } : null;
  }).filter(Boolean);

  const availableItems = items.filter(item => 
    !collection.items.some(ci => ci.itemId === item.id)
  );

  const handleSaveName = () => {
    if (editName.trim() && collection) {
      updateCollection({
        ...collection,
        name: editName.trim(),
        description: editDescription.trim() || undefined
      });
      setIsEditingName(false);
    }
  };

  const handleShareSettingsUpdate = () => {
    if (shareSettings && collection) {
      updateShareSettings(collection.id, shareSettings);
      setIsShareDialogOpen(false);
    }
  };

  const copyShareLink = () => {
    if (collection?.shareSettings.isEnabled) {
      const shareUrl = `${window.location.origin}/share/collection/${collection.shareSettings.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/collections")}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          {isEditingName ? (
            <div className="flex gap-2 items-center">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-bold"
              />
              <Button onClick={handleSaveName} size="sm">Save</Button>
              <Button onClick={() => setIsEditingName(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          ) : (
            <h1 
              className="text-3xl font-bold cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditingName(true)}
            >
              {collection.name}
            </h1>
          )}
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Share Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-sharing"
                    checked={shareSettings?.isEnabled || false}
                    onCheckedChange={(checked) => 
                      setShareSettings(prev => prev ? {...prev, isEnabled: checked} : undefined)
                    }
                  />
                  <Label htmlFor="enable-sharing">Enable Public Sharing</Label>
                </div>
                
                {shareSettings?.isEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Share Link</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={`${window.location.origin}/share/collection/${shareSettings.shareId}`}
                          readOnly 
                          className="text-sm"
                        />
                        <Button onClick={copyShareLink} size="icon" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Visible Information</Label>
                      <div className="space-y-2">
                        {Object.entries(shareSettings.displaySettings).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) => 
                                setShareSettings(prev => prev ? {
                                  ...prev,
                                  displaySettings: {...prev.displaySettings, [key]: checked}
                                } : undefined)
                              }
                            />
                            <Label className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <Button onClick={handleShareSettingsUpdate} className="w-full">
                  Update Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {collection.shareSettings.isEnabled && (
            <Button onClick={copyShareLink}>
              <Share className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          )}
        </div>
      </div>

      {isEditingName && (
        <div className="mb-6">
          <Label>Description</Label>
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Optional description for your collection..."
            maxLength={200}
          />
        </div>
      )}

      {collection.description && !isEditingName && (
        <p className="text-muted-foreground mb-6">{collection.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Items in Collection ({collectionItems.length})</h2>
          </div>
          
          <div className="space-y-3">
            {collectionItems.map((item: any) => (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.collectionNote && (
                        <p className="text-sm text-muted-foreground">{item.collectionNote}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItemFromCollection(collection.id, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {collectionItems.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">No items in this collection yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Add Items</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItemToCollection(collection.id, item.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {availableItems.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">No more items available to add.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {collection.shareSettings.isEnabled && (
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/share/collection/${collection.shareSettings.shareId}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Shared View
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
