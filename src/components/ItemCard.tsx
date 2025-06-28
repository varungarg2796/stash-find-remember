
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
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
  index?: number;
}

const ItemCard = ({ item, index = 0 }: ItemCardProps) => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.03, 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group shadow-lg cursor-pointer relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ItemCardImage 
            item={item} 
            onClick={handleCardClick}
            isExpired={isExpired}
            isExpiringSoon={isExpiringSoon}
          />
        </motion.div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <motion.h3 
                className="font-semibold text-lg leading-tight line-clamp-2 flex-1 pr-2" 
                onClick={handleCardClick}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  <DropdownMenuContent 
                    align="end" 
                    asChild
                    forceMount
                  >
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-popover text-popover-foreground shadow-md rounded-md border min-w-[8rem] overflow-hidden p-1 z-50"
                    >
                      <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }} className="rounded-sm">
                        <DropdownMenuItem onClick={handleEdit}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </motion.div>
                      <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }} className="rounded-sm">
                        <DropdownMenuItem onClick={() => openActionDialog('gift')}>
                          <Gift className="mr-2 h-4 w-4" />
                          Mark as Gifted
                        </DropdownMenuItem>
                      </motion.div>
                      <DropdownMenuSeparator />
                      <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }} className="rounded-sm">
                        <DropdownMenuItem onClick={() => openActionDialog('archive')}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </motion.div>
                      <motion.div whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }} className="rounded-sm">
                        <DropdownMenuItem 
                          onClick={confirmDelete}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </motion.div>
                    </motion.div>
                  </DropdownMenuContent>
                </AnimatePresence>
              </DropdownMenu>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.05), duration: 0.4 }}
            >
              <ItemCardDetails 
                item={item}
                isExpired={isExpired}
                isExpiringSoon={isExpiringSoon}
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showDeleteDialog && (
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-background text-foreground shadow-lg rounded-lg border max-w-lg"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Item</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{item.name}"? This action cannot be undone and the item will be permanently removed from your stash.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </motion.div>
                </AlertDialogFooter>
              </motion.div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActionDialogOpen && (
          <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
            <DialogContent asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-background text-foreground shadow-lg rounded-lg border max-w-lg"
              >
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
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>Cancel</Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={executeAction}>Confirm</Button>
                  </motion.div>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ItemCard;
