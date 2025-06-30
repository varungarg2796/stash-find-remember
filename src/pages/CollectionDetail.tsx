import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
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
  const { data: allItemsData } = useItemsQuery({ archived: false, limit: 1000 }, !!user); // Fetch all items

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
    const items = allItemsData?.data || [];
    if (!collection) return [];
    const itemIdsInCollection = new Set(collection.items.map(ci => ci.item.id));
    return items.filter(item => !itemIdsInCollection.has(item.id));
  }, [collection, allItemsData?.data]);
  
  // --- HANDLERS ---
  const handleSaveChanges = () => {
    if (!collection) return;
    updateCollectionMutation.mutate(
      { 
        id: collection.id, 
        data: { 
          name: editName, 
          description: editDescription, 
          coverImage: editCoverImage 
        } 
      },
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

  const previewSharedView = () => {
    if (collection?.shareSettings.isEnabled) {
      navigate(`/share/collection/${collection.shareSettings.shareId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <CollectionHeader
        onBack={() => navigate('/collections')}
        collection={collection}
        onShareSettingsUpdate={handleShareSettingsUpdate}
        onCopyShareLink={copyShareLink}
        onPreviewSharedView={previewSharedView}
      />

      {/* Hero Section with Collection Info */}
      <motion.div 
        className="relative bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-indigo-600/10 border-b border-purple-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">
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
          
          {/* Collection Stats */}
          <motion.div 
            className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">{collectionItems.length} items</span>
            </div>
            {collection?.createdAt && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Created {new Date(collection.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            {collection?.shareSettings?.isEnabled && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Publicly shared with people with URL</span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
      </motion.div>
    </div>
  );
};

export default CollectionDetail;