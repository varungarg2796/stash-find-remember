
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item } from "@/types";
import { 
  MapPin, 
  Tag, 
  Calendar, 
  Gift,
  Package,
  Archive,
  Trash2,
  Edit,
  MoreVertical,
  Clock
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useItems } from "@/context/ItemsContext";
import { toast } from "sonner";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import ItemCardImage from "./item/ItemCardImage";
import ItemCardDetails from "./item/ItemCardDetails";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const navigate = useNavigate();
  const { navigateWithState } = useNavigationHelper();
  const { useItem, giftItem, archiveItem, deleteItem } = useItems();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [actionType, setActionType] = useState<'gift' | 'archive' | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const handleUse = (note?: string) => {
    useItem({ id: item.id, note });
    // Don't navigate away for use action as item might still exist
  };

  const openActionDialog = (type: 'gift' | 'archive') => {
    setActionType(type);
    setActionNote('');
    setIsActionDialogOpen(true);
  };

  const executeAction = () => {
    if (!actionType) return;
    const params = { id: item.id, note: actionNote };

    switch (actionType) {
      case 'gift':
        giftItem(params);
        if (item.quantity <= 1) {
          navigate("/my-stash");
        }
        break;
      case 'archive':
        archiveItem(params);
        navigate("/my-stash");
        break;
    }
    setIsActionDialogOpen(false);
  };

  const handleDelete = () => {
    deleteItem(item.id);
    navigate("/my-stash");
    setShowDeleteDialog(false);
  };

  const confirmDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleEdit = () => {
    navigateWithState(`/edit-item/${item.id}`, "/my-stash");
  };

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  // Check if item is expiring soon (within 7 days) or expired
  const isExpiringSoon = item.expiryDate && isAfter(item.expiryDate, new Date()) && isBefore(item.expiryDate, addDays(new Date(), 7));
  const isExpired = item.expiryDate && isBefore(item.expiryDate, new Date());

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative animate-scale-in">
      <ItemCardImage 
        item={item} 
        onClick={handleCardClick}
        isExpired={isExpired}
        isExpiringSoon={isExpiringSoon}
      />

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 
              className="font-semibold text-lg leading-tight line-clamp-2 flex-1 pr-2" 
              onClick={handleCardClick}
            >
              {item.name}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-scale-in">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openActionDialog('gift')}>
                  <Gift className="mr-2 h-4 w-4" />
                  Mark as Gifted
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openActionDialog('archive')}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={confirmDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ItemCardDetails 
            item={item}
            isExpired={isExpired}
            isExpiringSoon={isExpiringSoon}
          />
        </div>
      </CardContent>


      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{item.name}"? This action cannot be undone and the item will be permanently removed from your stash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'gift' && 'Mark as Gifted'}
              {actionType === 'archive' && 'Archive Item'}
            </DialogTitle>
            <DialogDescription>Add an optional note for your item's history.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea 
              placeholder={actionType === 'gift' ? "e.g., Gifted to Jane for her birthday" : "e.g., No longer needed"} 
              value={actionNote} 
              onChange={(e) => setActionNote(e.target.value)} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>Cancel</Button>
            <Button onClick={executeAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ItemCard;
