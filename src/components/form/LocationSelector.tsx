import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { userApi } from "@/services/api/userApi";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
}

const LocationSelector = ({ value, onChange, isEditing = false }: LocationSelectorProps) => {
  const { user, updateUserInContext } = useAuth();
  const [showNewLocationForm, setShowNewLocationForm] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  
  // The user object now directly contains the locations array.
  // We no longer need a separate DEFAULT_LOCATIONS fallback here.
  const locations = user?.locations || [];
  
  const handleAddNewLocation = async () => {
    if (newLocationName.trim()) {
      // Check if location already exists
      const existingLocation = locations.find(loc => loc.name.toLowerCase() === newLocationName.trim().toLowerCase());
      if (existingLocation) {
        toast.error('Location already exists');
        return;
      }
      
      try {
        // Create new location object
        const newLocation = {
          id: Date.now().toString(), // Temporary ID
          name: newLocationName.trim()
        };
        
        // Update the user's locations array
        const updatedLocations = [...locations, newLocation];
        const locationNames = updatedLocations.map(loc => loc.name);
        
        // Save to backend using updatePreferences
        const updatedUser = await userApi.updatePreferences({ locations: locationNames });
        
        // Update user context with new data
        updateUserInContext(updatedUser);
        
        // Set the new location as selected
        onChange(newLocationName.trim());
        setNewLocationName('');
        setShowNewLocationForm(false);
        toast.success(`Added new location: "${newLocationName.trim()}"`);
      } catch (error) {
        toast.error('Failed to add location. Please try again.');
        console.error('Error adding location:', error);
      }
    }
  };
  
  const handleCancelNewLocation = () => {
    setNewLocationName('');
    setShowNewLocationForm(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNewLocation();
    } else if (e.key === 'Escape') {
      handleCancelNewLocation();
    }
  };

  return (
    <div>
      <div className="flex items-center mb-1">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <p className="text-xs text-gray-500 mt-1">Help you find it later</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {!showNewLocationForm ? (
          <div className="flex gap-2">
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="flex-1 h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="Select location..." />
              </SelectTrigger>
              <SelectContent>
                {/* We now map over an array of objects, using loc.id as the key and loc.name for the value/display */}
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewLocationForm(true)}
              className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
              title="Add new location"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter new location name"
              className="flex-1 h-12 sm:h-10 text-base sm:text-sm"
              autoFocus
            />
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleAddNewLocation}
              disabled={!newLocationName.trim()}
              className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelNewLocation}
              className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Quick location suggestions */}
        {locations.length === 0 && !showNewLocationForm && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="mb-2">💡 <strong>Quick start:</strong> Add your first location</p>
            <div className="flex gap-2 flex-wrap">
              {['Kitchen', 'Bedroom', 'Living Room', 'Garage', 'Office'].map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(suggestion)}
                  className="text-xs h-6 px-2 border border-gray-200 hover:bg-gray-100"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;