import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollectionSuggestion } from '@/services/api/aiApi';
import { AlertTriangle, FolderOpen, Plus } from 'lucide-react';

interface CollectionConflictModalProps {
  suggestion: CollectionSuggestion;
  isOpen: boolean;
  onClose: () => void;
  onCreateAnyway: () => void;
  onCancel: () => void;
}

export const CollectionConflictModal: React.FC<CollectionConflictModalProps> = ({
  suggestion,
  isOpen,
  onClose,
  onCreateAnyway,
  onCancel,
}) => {
  const alreadyCollected = suggestion.itemsAlreadyInCollections || [];
  const newItems = suggestion.itemIds.length - alreadyCollected.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </div>
            Create Additional Collection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-900">Collection: {suggestion.name}</h4>
              <div className="flex gap-2">
                {newItems > 0 && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    +{newItems} new items
                  </Badge>
                )}
                {alreadyCollected.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {alreadyCollected.length} shared items
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-purple-700 mb-3">{suggestion.description}</p>
          </div>

          {alreadyCollected.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900">Items also in other collections:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alreadyCollected.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">{item.itemName}</span>
                    <div className="flex flex-wrap gap-1">
                      {item.existingCollections.map((collection, collectionIndex) => (
                        <Badge
                          key={collectionIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          <FolderOpen className="h-3 w-3 mr-1" />
                          {collection.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              <strong>✓ Perfect!</strong> Items can belong to multiple collections. Creating "{suggestion.name}" will organize these items in a new way while keeping them in their existing collections too.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={onCreateAnyway}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};