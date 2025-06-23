import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import {
  useCollectionQuery,
  useUpdateCollectionMutation,
  useAddItemToCollectionMutation,
  useRemoveItemFromCollectionMutation,
  useReorderCollectionItemsMutation,
  useUpdateShareSettingsMutation,
} from '@/hooks/useCollectionsQuery';

import CollectionHeader from '@/components/collection/CollectionHeader';
import CollectionEditForm from '@/components/collection/CollectionEditForm';
import CollectionItemsSection from '@/components/collection/CollectionItemsSection';
import AddItemsSection from '@/components/collection/AddItemsSection';
import ErrorDisplay from '@/components/ErrorDisplay';
import { ShareSettings, ViewMode } from '@/types';
import { useItemsQuery } from '@/hooks/useItemsQuery';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // We need the full item list to determine which items are available to be added
  // This can be optimized later if the list is huge
  const { data: allItemsData } = useItemsQuery({ archived: false, limit: 1000 }); // Fetch all items
  const allUserItems = allItemsData?.data || [];

  // --- DATA FETCHING ---
  const { data: collection, isLoading, error } = useCollectionQuery(id!);

  // --- MUTATIONS ---
  const updateCollectionMutation = useUpdateCollectionMutation();
  const addItemMutation = useAddItemToCollectionMutation(id!);
  const removeItemMutation = useRemoveItemFromCollectionMutation(id!);
  const reorderItemsMutation = useReorderCollectionItemsMutation(id!);
  const updateShareSettingsMutation = useUpdateShareSettingsMutation(id!);

  // --- LOCAL UI STATE ---
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  
  // Sync local edit state when data loads
  useEffect(() => {
    if (collection) {
      setEditName(collection.name);
      setEditDescription(collection.description || '');
      setEditCoverImage(collection.coverImage || '');
    }
  }, [collection]);

  const collectionItems = useMemo(() => {
    if (!collection) return [];
    // The items are already ordered from the backend
    return collection.items.map(ci => ({ ...ci.item, collectionNote: ci.collectionNote }));
  }, [collection]);

  const availableItems = useMemo(() => {
    if (!collection) return [];
    const itemIdsInCollection = new Set(collection.items.map(ci => ci.item.id));
    return allUserItems.filter(item => !itemIdsInCollection.has(item.id));
  }, [collection, allUserItems]);
  
  // --- HANDLERS ---
  const handleSaveChanges = () => {
    if (!collection) return;
    updateCollectionMutation.mutate(
      { ...collection, name: editName, description: editDescription, coverImage: editCoverImage },
      { onSuccess: () => setIsEditingName(false) }
    );
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = collectionItems.findIndex((item) => item.id === active.id);
      const newIndex = collectionItems.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(collectionItems, oldIndex, newIndex);
      const payload = reordered.map((item, index) => ({ itemId: item.id, order: index }));
      reorderItemsMutation.mutate(payload);
    }
  };

  const handleShareSettingsUpdate = (settings: ShareSettings) => {
    updateShareSettingsMutation.mutate(settings);
  };

  const copyShareLink = () => {
    if (collection?.shareSettings.isEnabled) {
      const shareUrl = `${window.location.origin}/share/collection/${collection.shareSettings.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied!");
    }
  };

  // --- RENDER LOGIC ---
  if (!user) { navigate('/'); return null; }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <ErrorDisplay title="Collection Not Found" message="The collection you are looking for does not exist." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <CollectionHeader
        onBack={() => navigate('/collections')}
        collection={collection}
        onShareSettingsUpdate={handleShareSettingsUpdate}
        onCopyShareLink={copyShareLink}
      />

      <div className="px-4 py-6">
        <CollectionEditForm
          collection={collection}
          isEditingName={isEditingName}
          editName={editName}
          editDescription={editDescription}
          editCoverImage={editCoverImage}
          setEditName={setEditName}
          setEditDescription={setEditDescription}
          setEditCoverImage={setEditCoverImage}
          onSave={handleSaveChanges}
          onCancel={() => setIsEditingName(false)}
          onStartEdit={() => setIsEditingName(true)}
        />
      </div>

      <div className="px-4 py-6 space-y-6">
        <CollectionItemsSection
          isLoading={isLoading}
          collectionItems={collectionItems}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onDragEnd={handleDragEnd}
          onRemoveItem={(itemId) => removeItemMutation.mutate(itemId)}
        />
        <AddItemsSection
          availableItems={availableItems}
          onAddItem={(itemId) => addItemMutation.mutate(itemId)}
        />
        {collection.shareSettings.isEnabled && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={() => navigate(`/share/collection/${collection.shareSettings.shareId}`)}>
              <Eye className="mr-2 h-4 w-4" /> Preview Shared View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;