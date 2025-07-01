
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
  Package,
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
import { useItems } from "@/context/ItemsContext";
import { DeleteItemModal } from '@/components/DeleteItemModal';
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
  const { deleteItem } = useItems();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


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
      scale: 1
    }
  };


  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.03, 
        y: -4
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }}
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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

      <DeleteItemModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        itemName={item.name}
        itemId={item.id}
        isDeleting={false}
      />

    </motion.div>
  );
};

export default ItemCard;
