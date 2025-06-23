import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FolderOpen, Loader2 } from 'lucide-react';
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
  const { data: collections, isLoading, error } = useCollectionsQuery();
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
    // You can enhance this with the original "Please Login" splash screen if desired
    return <div>Please log in to view your collections.</div>;
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