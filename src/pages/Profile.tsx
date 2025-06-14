import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Plus, X, Tag, AlertTriangle, Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, updateUserPreferences, updateUsername, addLocation, removeLocation, addTag, removeTag } = useAuth();
  const { items } = useItems();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [username, setUsername] = useState<string>(user?.username || "");
  const [currency, setCurrency] = useState<string>(
    user?.preferences?.currency || "USD"
  );
  const [newLocation, setNewLocation] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [validationDialog, setValidationDialog] = useState<{
    open: boolean;
    type: 'locations' | 'tags';
    unusedItems: string[];
    usedItems: { name: string; items: string[] }[];
  }>({
    open: false,
    type: 'locations',
    unusedItems: [],
    usedItems: []
  });

  if (!user) {
    navigate("/");
    return null;
  }

  const checkSingleItemUsage = (itemToRemove: string, type: 'locations' | 'tags') => {
    const usingItems = items.filter(item => {
      if (type === 'locations') {
        return item.location === itemToRemove;
      } else {
        return item.tags.includes(itemToRemove);
      }
    }).map(item => item.name);

    return {
      isUsed: usingItems.length > 0,
      usingItems
    };
  };

  const handleRemoveLocation = (location: string) => {
    const usage = checkSingleItemUsage(location, 'locations');
    
    if (usage.isUsed) {
      setValidationDialog({
        open: true,
        type: 'locations',
        unusedItems: [],
        usedItems: [{ name: location, items: usage.usingItems }]
      });
      return;
    }
    
    removeLocation(location);
  };

  const handleRemoveTag = (tag: string) => {
    const usage = checkSingleItemUsage(tag, 'tags');
    
    if (usage.isUsed) {
      setValidationDialog({
        open: true,
        type: 'tags',
        unusedItems: [],
        usedItems: [{ name: tag, items: usage.usingItems }]
      });
      return;
    }
    
    removeTag(tag);
  };

  const checkItemUsage = (currentItems: string[], type: 'locations' | 'tags') => {
    const originalItems = type === 'locations' 
      ? user?.preferences?.locations || []
      : user?.preferences?.tags || [];
    
    // Find removed items
    const removedItems = originalItems.filter(item => !currentItems.includes(item));
    
    if (removedItems.length === 0) {
      return { canProceed: true, unusedItems: [], usedItems: [] };
    }

    // Check which removed items are being used
    const usedItems: { name: string; items: string[] }[] = [];
    const unusedItems: string[] = [];

    removedItems.forEach(removedItem => {
      const usingItems = items.filter(item => {
        if (type === 'locations') {
          return item.location === removedItem;
        } else {
          return item.tags.includes(removedItem);
        }
      }).map(item => item.name);

      if (usingItems.length > 0) {
        usedItems.push({ name: removedItem, items: usingItems });
      } else {
        unusedItems.push(removedItem);
      }
    });

    return {
      canProceed: usedItems.length === 0,
      unusedItems,
      usedItems
    };
  };

  const handleSavePreferences = async () => {
    const currentLocations = user?.preferences?.locations || [];
    const currentTags = user?.preferences?.tags || [];

    // Check locations
    const locationCheck = checkItemUsage(currentLocations, 'locations');
    if (!locationCheck.canProceed) {
      setValidationDialog({
        open: true,
        type: 'locations',
        unusedItems: locationCheck.unusedItems,
        usedItems: locationCheck.usedItems
      });
      return;
    }

    // Check tags
    const tagCheck = checkItemUsage(currentTags, 'tags');
    if (!tagCheck.canProceed) {
      setValidationDialog({
        open: true,
        type: 'tags',
        unusedItems: tagCheck.unusedItems,
        usedItems: tagCheck.usedItems
      });
      return;
    }

    // Show loading state and simulate API call
    setIsSaving(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If we get here, all validations passed
      updateUserPreferences({
        currency,
      });

      // Update username if changed
      if (username !== user.username) {
        updateUsername(username);
      }

      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidationDialogClose = () => {
    setValidationDialog({
      open: false,
      type: 'locations',
      unusedItems: [],
      usedItems: []
    });
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      addLocation(newLocation.trim());
      setNewLocation("");
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6 animate-fade-in-up">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm animate-scale-in">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.avatarUrl || "/placeholder.svg"} 
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover transition-transform duration-200 hover:scale-105"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Profile Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User size={16} />
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  maxLength={30}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
                <p className="text-xs text-muted-foreground">
                  This will appear on your shared collections
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger className="transition-all duration-200 hover:scale-[1.02]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="animate-scale-in">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">My Locations</h3>
            <p className="text-sm text-muted-foreground">
              Add up to 20 custom locations where you store your items.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add new location..."
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddLocation)}
                maxLength={30}
                className="flex-grow transition-all duration-200 focus:scale-[1.02]"
              />
              <Button 
                onClick={handleAddLocation} 
                variant="outline"
                disabled={!newLocation.trim() || (user.preferences?.locations?.length || 0) >= 20}
                className="transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {user.preferences?.locations?.map((location, index) => (
                <Badge 
                  key={location} 
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5 animate-slide-in-from-left transition-all duration-200 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Tag size={12} className="mr-1" />
                  {location}
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => handleRemoveLocation(location)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              {!user.preferences?.locations?.length && (
                <p className="text-sm text-muted-foreground py-2">
                  No locations added yet. Add your first location above.
                </p>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              {user.preferences?.locations?.length || 0}/20 locations used
            </p>
          </div>
          
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium">Common Tags</h3>
            <p className="text-sm text-muted-foreground">
              Add common tags that you frequently use for your items.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add common tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                maxLength={30}
                className="flex-grow transition-all duration-200 focus:scale-[1.02]"
              />
              <Button 
                onClick={handleAddTag} 
                variant="outline"
                disabled={!newTag.trim() || (user.preferences?.tags?.length || 0) >= 20}
                className="transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {user.preferences?.tags?.map((tag, index) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5 animate-slide-in-from-left transition-all duration-200 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              {!user.preferences?.tags?.length && (
                <p className="text-sm text-muted-foreground py-2">
                  No common tags added yet. Add your first tag above.
                </p>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              {user.preferences?.tags?.length || 0}/20 tags used
            </p>
          </div>

          <Button 
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="transition-all duration-200 hover:scale-105"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </div>

      <Dialog open={validationDialog.open} onOpenChange={handleValidationDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2" size={20} />
              Cannot Remove {validationDialog.type === 'locations' ? 'Location' : 'Tag'}
            </DialogTitle>
            <DialogDescription>
              This {validationDialog.type === 'locations' ? 'location' : 'tag'} is currently being used by your items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {validationDialog.usedItems.map((usedItem, index) => (
              <div key={index} className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="font-medium text-red-800 mb-2">
                  "{usedItem.name}" is used by:
                </div>
                <ScrollArea className="max-h-24">
                  <div className="space-y-1">
                    {usedItem.items.slice(0, 10).map((itemName, itemIndex) => (
                      <div key={itemIndex} className="text-sm text-red-700">
                        • {itemName}
                      </div>
                    ))}
                    {usedItem.items.length > 10 && (
                      <div className="text-sm text-red-600 font-medium">
                        ... and {usedItem.items.length - 10} more items
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            ))}
            
            <div className="text-sm text-gray-600 mt-4">
              Please update these items first before removing the {validationDialog.type === 'locations' ? 'location' : 'tag'}.
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleValidationDialogClose}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
