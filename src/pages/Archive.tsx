import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import ItemList from '@/components/ItemList';
import { ArrowLeft, Box, Loader2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useItemsQuery } from '@/hooks/useItemsQuery';
import { useItems } from '@/context/ItemsContext';
import ErrorDisplay from '@/components/ErrorDisplay';
import { DeleteItemModal } from '@/components/DeleteItemModal';

const Archive = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // We still use the context for actions, but not for fetching
  const { deleteItem, restoreItem } = useItems();
  
  const [sortBy, setSortBy] = useState<string>('newest');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  // --- DATA FETCHING with TanStack Query ---
  // We call useItemsQuery with the specific filter for archived items
  const { data: queryData, isLoading, error } = useItemsQuery({
    archived: true,
    sort: sortBy,
    // Add pagination if you want, but for an archive, a long list is often fine
    limit: 100, // Fetch up to 100 archived items
  }, !!user);
  
  const archivedItems = queryData?.data || [];

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);


  const handleDelete = (id: string) => {
    const item = archivedItems.find(item => item.id === id);
    if (item) {
      setItemToDelete({ id, name: item.name });
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };
  
  const handleRestore = (id: string) => {
    // The restoreItem function in the context now handles the toast
    restoreItem({ id, note: 'Restored from archive' });
  };
  
  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center">
            <Box className="mr-2" />
            Archive
          </h1>
          <p className="text-muted-foreground text-sm">Items that have been used, gifted, or otherwise archived.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : error ? (
        <ErrorDisplay title="Could Not Load Archive" message={error.message} />
      ) : archivedItems.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {archivedItems.length} archived item{archivedItems.length !== 1 ? 's' : ''}
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6">
            <ItemList 
              items={archivedItems}
              isArchive={true}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Box size={40} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">Your archive is empty</h3>
          <p className="text-muted-foreground mb-4">
            Used, gifted, or archived items will appear here.
          </p>
          <Button variant="outline" onClick={() => navigate('/my-stash')}>
            Back to My Stash
          </Button>
        </div>
      )}
      
      <DeleteItemModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ''}
        itemId={itemToDelete?.id || ''}
        isDeleting={false}
      />
    </div>
  );
};

export default Archive;