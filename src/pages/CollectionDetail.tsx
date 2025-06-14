
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCollections } from "@/context/CollectionsContext";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { toast } from "sonner";
import { arrayMove } from '@dnd-kit/sortable';
import { ViewMode, Collection, CollectionItem } from "@/types";
import CollectionHeader from "@/components/collection/CollectionHeader";
import CollectionEditForm from "@/components/collection/CollectionEditForm";
import UnsavedChangesBar from "@/components/collection/UnsavedChangesBar";
import CollectionItemsSection from "@/components/collection/CollectionItemsSection";
import AddItemsSection from "@/components/collection/AddItemsSection";

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
  const [shareSettings, setShareSettings] = useState(originalCollection?.shareSettings);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isLoading, setIsLoading] = useState(true);

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
                <Package className="mr-2 h-4 w-4" />
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
      {localCollection && (
        <CollectionHeader
          onBack={() => navigate("/collections")}
          collection={localCollection}
          shareSettings={shareSettings}
          setShareSettings={setShareSettings}
          onShareSettingsUpdate={handleShareSettingsUpdate}
          onCopyShareLink={copyShareLink}
        />
      )}

      <div className="px-4 py-6">
        {localCollection && (
          <CollectionEditForm
            collection={localCollection}
            isEditingName={isEditingName}
            editName={editName}
            editDescription={editDescription}
            editCoverImage={editCoverImage}
            setEditName={setEditName}
            setEditDescription={setEditDescription}
            setEditCoverImage={setEditCoverImage}
            onSave={handleSaveName}
            onCancel={() => setIsEditingName(false)}
            onStartEdit={() => setIsEditingName(true)}
          />
        )}

        <UnsavedChangesBar
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSaveChanges}
          onDiscard={handleDiscardChanges}
        />
      </div>

      <div className="px-4 py-6 space-y-6">
        <CollectionItemsSection
          isLoading={isLoading}
          collectionItems={collectionItems}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onDragEnd={handleDragEnd}
          onRemoveItem={handleRemoveItem}
        />

        {!isLoading && localCollection && (
          <AddItemsSection
            availableItems={availableItems}
            onAddItem={handleAddItemToCollection}
          />
        )}

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
