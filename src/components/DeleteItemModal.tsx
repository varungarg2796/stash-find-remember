import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Trash2, FolderOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collectionsApi } from '@/services/api/collectionsApi';

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemId: string;
  isDeleting?: boolean;
}

export const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemId,
  isDeleting = false
}) => {
  // Query to get collections that contain this item
  const { data: collections, isLoading: loadingCollections } = useQuery({
    queryKey: ['itemCollections', itemId],
    queryFn: async () => {
      // Get all collections and filter for ones containing this item
      const allCollections = await collectionsApi.getAll();
      return allCollections.filter(collection => 
        collection.items?.some(item => item.itemId === itemId)
      );
    },
    enabled: isOpen && !!itemId,
  });

  const hasCollections = collections && collections.length > 0;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Item
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold">"{itemName}"</span>?
              </p>
              
              {loadingCollections && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking collections...
                </div>
              )}

              {hasCollections && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-amber-800">
                        Collection Warning
                      </p>
                      <p className="text-sm text-amber-700">
                        This item is currently part of{' '}
                        {collections.length === 1 ? 'this collection' : 'these collections'}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {collections.map((collection) => (
                          <Badge 
                            key={collection.id} 
                            variant="outline" 
                            className="text-xs bg-white border-amber-300"
                          >
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {collection.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-amber-700">
                        Deleting this item will automatically remove it from{' '}
                        {collections.length === 1 ? 'this collection' : 'all these collections'}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!loadingCollections && !hasCollections && (
                <div className="text-sm text-muted-foreground">
                  This item is not part of any collections.
                </div>
              )}

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-medium text-red-800">
                    This action cannot be undone
                  </p>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  The item and all its data will be permanently deleted from your inventory.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || loadingCollections}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Item
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};