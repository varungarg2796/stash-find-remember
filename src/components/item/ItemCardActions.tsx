
import { useState } from "react";
import { Item } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ItemCardActionsProps {
  item: Item;
  onUse: (note?: string) => void;
  onGift: (note?: string) => void;
  onArchive: (note?: string) => void;
  onDelete: () => void;
}

const ItemCardActions = ({ item, onUse, onGift, onArchive, onDelete }: ItemCardActionsProps) => {
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [giftRecipient, setGiftRecipient] = useState("");

  const handleUse = () => {
    onUse(actionNote || undefined);
    setShowUseDialog(false);
    setActionNote("");
  };

  const handleGift = () => {
    const note = giftRecipient ? `Gifted to ${giftRecipient}${actionNote ? `: ${actionNote}` : ''}` : actionNote;
    onGift(note || undefined);
    setShowGiftDialog(false);
    setActionNote("");
    setGiftRecipient("");
  };

  const handleArchive = () => {
    onArchive(actionNote || undefined);
    setShowArchiveDialog(false);
    setActionNote("");
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      {/* Use Dialog */}
      <AlertDialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Used</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this item as used?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <label htmlFor="note" className="text-right inline-block w-16 pr-1 text-sm font-medium text-gray-700">
              Note:
            </label>
            <Textarea
              id="note"
              placeholder="Add a note (optional)"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionNote("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUse}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gift Dialog */}
      <AlertDialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Gift Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this item as gifted?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <label htmlFor="recipient" className="text-right inline-block w-24 pr-1 text-sm font-medium text-gray-700">
              Recipient:
            </label>
            <Input
              id="recipient"
              placeholder="Enter recipient's name (optional)"
              value={giftRecipient}
              onChange={(e) => setGiftRecipient(e.target.value)}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
            <label htmlFor="note" className="text-right inline-block w-16 pr-1 text-sm font-medium text-gray-700">
              Note:
            </label>
            <Textarea
              id="note"
              placeholder="Add a note (optional)"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setActionNote("");
              setGiftRecipient("");
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGift}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <label htmlFor="note" className="text-right inline-block w-16 pr-1 text-sm font-medium text-gray-700">
              Note:
            </label>
            <Textarea
              id="note"
              placeholder="Add a note (optional)"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionNote("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ItemCardActions;
