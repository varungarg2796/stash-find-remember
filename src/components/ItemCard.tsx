
import { useNavigate } from "react-router-dom";
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
import { useItems } from "@/context/ItemsContext";
import { toast } from "sonner";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import ItemCardImage from "./item/ItemCardImage";
import ItemCardDetails from "./item/ItemCardDetails";
import ItemCardActions from "./item/ItemCardActions";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const navigate = useNavigate();
  const { navigateWithState } = useNavigationHelper();
  const { useItem, giftItem, archiveItem, deleteItem } = useItems();

  const handleUse = (note?: string) => {
    useItem(item.id, note);
    // Don't navigate away for use action as item might still exist
  };

  const handleGift = (note?: string) => {
    giftItem(item.id, note);
    if (item.quantity <= 1) {
      navigate("/my-stash");
    }
  };

  const handleArchive = (note?: string) => {
    archiveItem(item.id, note);
    navigate("/my-stash");
  };

  const handleDelete = () => {
    deleteItem(item.id);
    navigate("/my-stash");
    toast.success("Item deleted successfully");
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
                <DropdownMenuItem onClick={() => handleUse()}>
                  <Package className="mr-2 h-4 w-4" />
                  Mark as Used
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGift()}>
                  <Gift className="mr-2 h-4 w-4" />
                  Gift Item
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleArchive()}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
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

      <ItemCardActions
        item={item}
        onUse={handleUse}
        onGift={handleGift}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </Card>
  );
};

export default ItemCard;
