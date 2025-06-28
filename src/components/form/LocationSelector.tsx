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
  
  // The user object now directly contains the locations array.
  // We no longer need a separate DEFAULT_LOCATIONS fallback here.
  const locations = user?.locations || [];

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
                  You can add or remove locations in your profile settings.
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
          {/* We now map over an array of objects, using loc.id as the key and loc.name for the value/display */}
          {locations.map(loc => (
            <SelectItem key={loc.id} value={loc.name}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;