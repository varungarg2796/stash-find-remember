
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Edit, Trash2, Tag, MapPin, 
  Heart, Gift, Archive, 
  Calendar, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemHistory from "@/components/ItemHistory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getDefaultImage } from "@/utils/imageUtils";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getItem, deleteItem, updateItem, giftItem, archiveItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const item = getItem(id || "");
  const [activeTab, setActiveTab] = useState("details");
  const [actionNote, setActionNote] = useState("");
  const [actionType, setActionType] = useState<"gift" | "archive" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (!item) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500">Item not found.</p>
        </div>
      </div>
    );
  }
  
  const handleEdit = () => {
    navigate(`/edit-item/${id}`);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(item.id);
      navigate("/");
    }
  };

  const openActionDialog = (type: "gift" | "archive") => {
    setActionType(type);
    setActionNote("");
    setDialogOpen(true);
  };

  const executeAction = () => {
    if (!actionType) return;

    switch (actionType) {
      case "gift":
        giftItem(item.id, actionNote);
        if (item.quantity <= 1) navigate("/");
        break;
      case "archive":
        archiveItem(item.id, actionNote);
        navigate("/");
        break;
    }
    
    setDialogOpen(false);
  };

  // Function to generate a consistent color based on item name
  const getColorForItem = (name: string): string => {
    const colors = [
      "bg-blue-200", "bg-green-200", "bg-yellow-200", 
      "bg-red-200", "bg-purple-200", "bg-pink-200",
      "bg-indigo-200", "bg-teal-200", "bg-orange-200"
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    hash = Math.abs(hash);
    const index = hash % colors.length;
    
    return colors[index];
  };

  const placeholderColor = getColorForItem(item.name);
  const defaultImage = getDefaultImage(item);

  const getActionButton = () => {
    if (item.archived) {
      return (
        <Button 
          onClick={handleDelete}
          className="w-full"
          variant="destructive"
        >
          <Trash2 className="mr-2" size={18} />
          Delete Permanently
        </Button>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => openActionDialog("gift")}
        >
          <Gift className="mr-2" size={18} />
          Gift Item
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => openActionDialog("archive")}
        >
          <Archive className="mr-2" size={18} />
          Archive
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="relative">
          <AspectRatio ratio={16/9} className="bg-gray-50">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            ) : defaultImage ? (
              <img 
                src={defaultImage} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${placeholderColor} text-gray-700 text-6xl font-bold`}>
                {item.name.charAt(0).toUpperCase()}
              </div>
            )}
          </AspectRatio>
          
          {!item.archived && (
            <Button 
              onClick={handleEdit}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800"
              size="sm"
            >
              <Edit className="mr-2" size={16} />
              Edit Item
            </Button>
          )}
          
          {item.priceless && (
            <div className="absolute top-4 left-4 bg-pink-100 text-pink-700 px-3 py-1 rounded-full flex items-center shadow-sm">
              <Heart className="mr-1" size={16} fill="currentColor" />
              Priceless
            </div>
          )}
          
          {item.archived && (
            <div className="absolute bottom-0 inset-x-0 bg-gray-800/70 text-white py-2 px-4 flex items-center justify-center">
              <Archive className="mr-2" size={16} />
              <span className="font-medium">Archived Item</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{item.name}</h1>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              Added {format(new Date(item.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span key={index} className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                    <Tag size={14} className="mr-1 text-gray-500" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{item.description || "No description provided."}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-1">Quantity</h2>
                  <p className="text-2xl font-bold text-gray-800">{item.quantity}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-1">Location</h2>
                  <p className="text-gray-700 flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-500" />
                    {item.location || "Not specified"}
                  </p>
                </div>
                
                {(item.price !== undefined || item.priceless) && (
                  <div className="bg-gray-50 p-4 rounded-lg col-span-1 sm:col-span-2">
                    <h2 className="text-lg font-semibold mb-1">Value</h2>
                    {item.priceless ? (
                      <p className="flex items-center text-pink-700">
                        <Heart size={16} className="mr-1" fill="currentColor" />
                        Priceless (Sentimental Value)
                      </p>
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">
                        ${item.price?.toFixed(2) || "Not specified"}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {getActionButton()}
              
              {!item.archived && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleEdit} className="flex-1">
                    <Edit className="mr-2" size={18} />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="flex-1">
                    <Trash2 className="mr-2" size={18} />
                    Delete
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <ItemHistory item={item} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "gift" && "Gift Item"}
              {actionType === "archive" && "Archive Item"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "gift" && "Mark this item as gifted to someone."}
              {actionType === "archive" && "Move this item to the archive."}
              
              {actionType === "gift" && item.quantity <= 1 && (
                <div className="flex items-center mt-2 text-amber-600">
                  <AlertTriangle size={16} className="mr-1" />
                  <span>This is your last item. It will be archived.</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <label className="text-sm font-medium mb-1 block">Add a note (optional)</label>
            <Textarea
              placeholder="Add a note about this action..."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={executeAction}>
              {actionType === "gift" && "Gift Item"}
              {actionType === "archive" && "Archive Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemDetail;
