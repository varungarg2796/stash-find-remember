
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Plus, X, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { user, updateUserPreferences, addLocation, removeLocation, addTag, removeTag } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState<"light" | "dark">(
    user?.preferences?.theme || "light"
  );
  const [currency, setCurrency] = useState<string>(
    user?.preferences?.currency || "USD"
  );
  const [newLocation, setNewLocation] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSavePreferences = () => {
    updateUserPreferences({
      theme,
      currency,
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
    <div className="max-w-screen-md mx-auto px-4 py-6">
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

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.avatarUrl || "/placeholder.svg"} 
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <Select
                  value={theme}
                  onValueChange={(value: "light" | "dark") => setTheme(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
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
                className="flex-grow"
              />
              <Button 
                onClick={handleAddLocation} 
                variant="outline"
                disabled={!newLocation.trim() || (user.preferences?.locations?.length || 0) >= 20}
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {user.preferences?.locations?.map((location) => (
                <Badge 
                  key={location} 
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5"
                >
                  <Tag size={12} className="mr-1" />
                  {location}
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => removeLocation(location)}
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
                className="flex-grow"
              />
              <Button 
                onClick={handleAddTag} 
                variant="outline"
                disabled={!newTag.trim() || (user.preferences?.tags?.length || 0) >= 20}
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {user.preferences?.tags?.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5"
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => removeTag(tag)}
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

          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
