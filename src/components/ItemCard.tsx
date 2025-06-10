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
import { useState } from "react";
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

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const navigate = useNavigate();
  const { useItem, giftItem, archiveItem, deleteItem } = useItems();
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [giftRecipient, setGiftRecipient] = useState("");

  const handleUse = () => {
    useItem(item.id, actionNote || undefined);
    setShowUseDialog(false);
    setActionNote("");
  };

  const handleGift = () => {
    const note = giftRecipient ? `Gifted to ${giftRecipient}${actionNote ? `: ${actionNote}` : ''}` : actionNote;
    giftItem(item.id, note || undefined);
    setShowGiftDialog(false);
    setActionNote("");
    setGiftRecipient("");
  };

  const handleArchive = () => {
    archiveItem(item.id, actionNote || undefined);
    setShowArchiveDialog(false);
    setActionNote("");
  };

  const handleDelete = () => {
    deleteItem(item.id);
    setShowDeleteDialog(false);
    toast.success("Item deleted successfully");
  };

  // Check if item is expiring soon (within 7 days) or expired
  const isExpiringSoon = item.expiryDate && isAfter(item.expiryDate, new Date()) && isBefore(item.expiryDate, addDays(new Date(), 7));
  const isExpired = item.expiryDate && isBefore(item.expiryDate, new Date());

  return (
    <>
      <Card className="group hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer relative">
        <div onClick={() => navigate(`/items/${item.id}`)} className="relative">
          <div className="aspect-square relative">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            ) : item.iconType ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg">
                <div className="text-6xl">
                  {item.iconType}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center">
                <Package className="h-16 w-16 text-slate-400" />
              </div>
            )}
            
            {/* Expiry status indicator */}
            {isExpired && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Expired
              </div>
            )}
            {isExpiringSoon && !isExpired && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Expires Soon
              </div>
            )}

            {/* Quantity badge */}
            {item.quantity > 1 && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {item.quantity}
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 flex-1 pr-2" onClick={() => navigate(`/items/${item.id}`)}>
                {item.name}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/items/${item.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowUseDialog(true)}>
                    <Package className="mr-2 h-4 w-4" />
                    Mark as Used
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowGiftDialog(true)}>
                    <Gift className="mr-2 h-4 w-4" />
                    Gift Item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowArchiveDialog(true)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Location */}
            {item.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
            )}

            {/* Expiry Date */}
            {item.expiryDate && (
              <div className={`flex items-center text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {isExpired ? 'Expired' : 'Expires'} {format(item.expiryDate, "MMM d, yyyy")}
                </span>
              </div>
            )}

            {/* Acquisition Date */}
            {item.acquisitionDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Added {format(item.acquisitionDate, "MMM d, yyyy")}</span>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex items-start gap-1 flex-wrap">
                <Tag className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex gap-1 flex-wrap">
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            {item.price && !item.priceless && (
              <div className="text-sm font-medium text-green-600">
                ${item.price.toFixed(2)}
              </div>
            )}
            {item.priceless && (
              <div className="text-sm font-medium text-purple-600">
                Priceless
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AlertDialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <AlertDialogContent>
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
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionNote("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUse}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <AlertDialogContent>
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
            />
            <label htmlFor="note" className="text-right inline-block w-16 pr-1 text-sm font-medium text-gray-700">
              Note:
            </label>
            <Textarea
              id="note"
              placeholder="Add a note (optional)"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
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

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
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
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionNote("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
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

export default ItemCard;
