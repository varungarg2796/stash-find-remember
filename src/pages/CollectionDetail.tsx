
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { ArrowLeft, Plus, Share, Copy, Eye, Settings, Grid, List, Package, Save } from "lucide-react";
import { toast } from "sonner";
import ViewToggle from "@/components/ViewToggle";
import CoverImageUploader from "@/components/form/CoverImageUploader";
import DraggableItemCard from "@/components/items/DraggableItemCard";
import ItemCardSkeleton from "@/components/ItemCardSkeleton";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ViewMode, Collection, CollectionItem } from "@/types";

const CollectionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getCollection, updateCollection, updateShareSettings } = useCollections();
  const { items } = useItems();
  const navigate = useNavigate();
  
  const originalCollection = getCollection(id!);
  
  // Local state for pending changes
  const [localCollection, setLocalCollection] = useState<Collection | null>(originalCollection);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(originalCollection?.name || "");
  const [editDescription, setEditDescription] = useState(originalCollection?.description || "");
  const [editCoverImage, setEditCoverImage] = useState(originalCollection?.coverImage || "");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareSettings, setShareSettings] = useState(originalCollection?.shareSettings);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const updateCollectionData = () => {
      if (isMounted) {
        const updatedCollection = getCollection(id!);
        if (!hasUnsavedChanges) {
          setLocalCollection(updatedCollection);
          setShareSettings(updatedCollection?.shareSettings);
          setEditCoverImage(updatedCollection?.coverImage || "");
        }
      }
    };
    
    updateCollectionData();
    
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 800);
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id, getCollection, hasUnsavedChanges]);

  const collectionItems = useMemo(() => {
    if (!localCollection) return [];
    
    return localCollection.items
      .sort((a, b) => a.order - b.order)
      .map(collectionItem => {
        const item = items.find(i => i.id === collectionItem.itemId);
        return item ? { ...item, collectionNote: collectionItem.collectionNote } : null;
      }).filter(Boolean);
  }, [localCollection, items]);

  const availableItems = useMemo(() => {
    return items.filter(item => 
      !localCollection?.items.some(ci => ci.itemId === item.id)
    );
  }, [items, localCollection]);

  const handleSaveName = useCallback(() => {
    if (editName.trim() && localCollection) {
      setLocalCollection({
        ...localCollection,
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        coverImage: editCoverImage || undefined
      });
      setHasUnsavedChanges(true);
      setIsEditingName(false);
    }
  }, [editName, editDescription, editCoverImage, localCollection]);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && localCollection) {
      const oldIndex = collectionItems.findIndex((item: any) => item.id === active.id);
      const newIndex = collectionItems.findIndex((item: any) => item.id === over.id);
      
      const reorderedItems = arrayMove(collectionItems, oldIndex, newIndex);
      const updatedCollectionItems = reorderedItems.map((item: any, index) => ({
        itemId: item.id,
        collectionNote: item.collectionNote,
        order: index
      }));
      
      setLocalCollection({
        ...localCollection,
        items: updatedCollectionItems
      });
      setHasUnsavedChanges(true);
    }
  }, [localCollection, collectionItems]);

  const handleShareSettingsUpdate = useCallback(() => {
    if (shareSettings && localCollection) {
      updateShareSettings(localCollection.id, shareSettings);
      setIsShareDialogOpen(false);
    }
  }, [shareSettings, localCollection, updateShareSettings]);

  const copyShareLink = useCallback(() => {
    if (localCollection?.shareSettings.isEnabled) {
      const shareUrl = `${window.location.origin}/share/collection/${localCollection.shareSettings.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    }
  }, [localCollection]);

  const handleAddItemToCollection = useCallback((itemId: string) => {
    if (localCollection) {
      const existingItem = localCollection.items.find(item => item.itemId === itemId);
      if (existingItem) {
        toast.error("Item already in collection");
        return;
      }
      
      const newItem: CollectionItem = {
        itemId,
        order: localCollection.items.length
      };
      
      setLocalCollection({
        ...localCollection,
        items: [...localCollection.items, newItem]
      });
      setHasUnsavedChanges(true);
    }
  }, [localCollection]);

  const handleRemoveItem = useCallback((itemId: string) => {
    if (localCollection) {
      setLocalCollection({
        ...localCollection,
        items: localCollection.items.filter(item => item.itemId !== itemId)
      });
      setHasUnsavedChanges(true);
    }
  }, [localCollection]);

  const handleSaveChanges = useCallback(() => {
    if (localCollection && hasUnsavedChanges) {
      updateCollection(localCollection);
      setHasUnsavedChanges(false);
      toast.success("Collection saved successfully");
    }
  }, [localCollection, hasUnsavedChanges, updateCollection]);

  const handleDiscardChanges = useCallback(() => {
    const originalCollection = getCollection(id!);
    setLocalCollection(originalCollection);
    setEditName(originalCollection?.name || "");
    setEditDescription(originalCollection?.description || "");
    setEditCoverImage(originalCollection?.coverImage || "");
    setShareSettings(originalCollection?.shareSettings);
    setHasUnsavedChanges(false);
    setIsEditingName(false);
    toast.success("Changes discarded");
  }, [id, getCollection]);

  if (!user) {
    navigate("/");
    return null;
  }

  if (!localCollection && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-md mx-auto px-4 py-6">
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Collection Not Found</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The collection you're looking for doesn't exist or may have been removed.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/collections")} size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collections
              </Button>
              <div>
                <Button onClick={() => navigate("/my-stash")} variant="outline">
                  Go to My Stash
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/collections")}
            >
              <ArrowLeft size={18} />
            </Button>
            
            {localCollection && (
              <div className="flex gap-2">
                <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="animate-scale-in">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm mx-4 animate-scale-in">
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
                                className="text-xs"
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
                
                {localCollection.shareSettings.isEnabled && (
                  <Button onClick={copyShareLink} size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Collection title and edit */}
          {localCollection && (isEditingName ? (
            <div className="space-y-3">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-lg font-semibold"
                placeholder="Collection name"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description..."
                maxLength={200}
                rows={2}
              />
              <CoverImageUploader 
                imageUrl={editCoverImage}
                onImageChange={setEditCoverImage}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveName} size="sm" className="flex-1">Save</Button>
                <Button onClick={() => setIsEditingName(false)} variant="outline" size="sm" className="flex-1">Cancel</Button>
              </div>
            </div>
          ) : (
            <div 
              className="cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {localCollection.coverImage && (
                <div className="w-full h-24 mb-3 rounded-lg overflow-hidden">
                  <img 
                    src={localCollection.coverImage} 
                    alt={localCollection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-xl font-bold">{localCollection.name}</h1>
              {localCollection.description && (
                <p className="text-sm text-muted-foreground mt-1">{localCollection.description}</p>
              )}
            </div>
          ))}

          {/* Save/Discard Changes Bar */}
          {hasUnsavedChanges && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-orange-800">
                  <Save className="h-4 w-4 mr-2" />
                  You have unsaved changes
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDiscardChanges} variant="outline" size="sm">
                    Discard
                  </Button>
                  <Button onClick={handleSaveChanges} size="sm">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Collection items section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Items {!isLoading && `(${collectionItems.length})`}
            </h2>
            {!isLoading && collectionItems.length > 0 && (
              <ViewToggle 
                activeView={viewMode}
                onViewChange={setViewMode}
              />
            )}
          </div>
          
          {isLoading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
              {Array.from({ length: 6 }).map((_, index) => (
                <ItemCardSkeleton key={index} viewMode={viewMode} />
              ))}
            </div>
          ) : collectionItems.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">No items in this collection yet.</p>
                <Button 
                  onClick={() => navigate("/add-item")}
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={collectionItems.map((item: any) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                  {collectionItems.map((item: any) => (
                    <DraggableItemCard
                      key={item.id}
                      item={item}
                      viewMode={viewMode}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Add items section */}
        {!isLoading && localCollection && availableItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Add Items</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddItemToCollection(item.id)}
                        className="flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Preview shared view button */}
        {!isLoading && localCollection?.shareSettings.isEnabled && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/share/collection/${localCollection.shareSettings.shareId}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Shared View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
