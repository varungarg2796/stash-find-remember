import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Share } from 'lucide-react';
import { Collection } from '@/types';

// The collection prop will now have the _count property from the API
type CollectionWithCount = Collection & {
  _count?: {
    items: number;
  };
};

interface CollectionCardProps {
  collection: CollectionWithCount;
  onEdit: (params: { id: string; data: { name?: string; description?: string; coverImage?: string } }) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void;
}

const CollectionCard = ({ collection, onEdit, onDelete, onNavigate }: CollectionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [editDescription, setEditDescription] = useState(collection.description || "");

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEdit({
        id: collection.id,
        data: {
          name: editName.trim(),
          description: editDescription.trim() || undefined
        }
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(collection.name);
    setEditDescription(collection.description || "");
  };

  // --- THIS IS THE FIX ---
  // Safely get the item count from the _count object, defaulting to 0
  const itemCount = collection._count?.items ?? 0;
  // -----------------------

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          {isEditing ? (
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
                <Button onClick={handleSaveEdit} size="sm" className="flex-1">Save</Button>
                <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <span className="truncate pr-2">{collection.name}</span>
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(collection.id)} className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardTitle>
      </CardHeader>
      {!isEditing && (
        <CardContent className="pt-0">
          {collection.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{collection.description}</p>
          )}
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-muted-foreground font-medium">
              {/* Use the safe itemCount variable here */}
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </span>
            {collection.shareSettings && (
              <div className="flex items-center gap-1">
                {collection.shareSettings.isEnabled && <Share className="h-3 w-3 text-green-600" />}
                <span className={collection.shareSettings.isEnabled ? "text-green-600 font-medium" : "text-muted-foreground"}>
                  {collection.shareSettings.isEnabled ? "Shared" : "Private"}
                </span>
              </div>
            )}
          </div>
          <Button className="w-full" variant="outline" onClick={() => onNavigate(collection.id)}>
            View Collection
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default CollectionCard;