
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
}

const LocationSelector = ({ value, onChange, isEditing = false }: LocationSelectorProps) => {
  const { user } = useAuth();
  
  // Get locations from user preferences, filtering out empty strings
  const locations = (user?.preferences?.locations || [
    "Kitchen", "Bedroom", "Wardrobe", "Drawer", 
    "Garage", "Attic", "Basement", "Other"
  ]).filter(loc => loc && loc.trim() !== "");

  return (
    <div>
      <div className="flex items-center mb-1">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        
        {isEditing && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2">
                  <Info size={14} className="text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px]">
                  You can configure locations in your profile settings.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map(loc => (
            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
