
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CoverImageUploader from "@/components/form/CoverImageUploader";
import { Collection } from "@/types";

interface CollectionEditFormProps {
  collection: Collection;
  isEditingName: boolean;
  editName: string;
  editDescription: string;
  editCoverImage: string;
  setEditName: (name: string) => void;
  setEditDescription: (description: string) => void;
  setEditCoverImage: (image: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEdit: () => void;
}

const CollectionEditForm = ({
  collection,
  isEditingName,
  editName,
  editDescription,
  editCoverImage,
  setEditName,
  setEditDescription,
  setEditCoverImage,
  onSave,
  onCancel,
  onStartEdit
}: CollectionEditFormProps) => {
  if (isEditingName) {
    return (
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
          <Button onClick={onSave} size="sm" className="flex-1">Save</Button>
          <Button onClick={onCancel} variant="outline" size="sm" className="flex-1">Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cursor-pointer" onClick={onStartEdit}>
      {collection.coverImage && (
        <div className="w-full h-24 mb-3 rounded-lg overflow-hidden">
          <img 
            src={collection.coverImage} 
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h1 className="text-xl font-bold">{collection.name}</h1>
      {collection.description && (
        <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
      )}
    </div>
  );
};

export default CollectionEditForm;
