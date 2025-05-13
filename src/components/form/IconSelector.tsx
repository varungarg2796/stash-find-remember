
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { availableIcons } from "@/utils/iconUtils";
import { X } from "lucide-react";

interface IconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (icon: string | null) => void;
}

const IconSelector = ({ selectedIcon, onSelectIcon }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the selected icon component
  const selectedIconData = availableIcons.find(icon => icon.name === selectedIcon);
  
  return (
    <div className="my-4">
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Choose an Icon
        </label>
      </div>
      
      <div className="w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-2">
                {selectedIconData ? (
                  <>
                    <selectedIconData.component size={18} />
                    <span>{selectedIconData.label}</span>
                  </>
                ) : (
                  <span>Select an icon</span>
                )}
              </div>
              {selectedIcon && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 rounded-full p-0 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIcon(null);
                  }}
                >
                  <X size={14} />
                  <span className="sr-only">Reset selection</span>
                </Button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-3 z-50 bg-white" align="start">
            <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {availableIcons.map((icon) => (
                <Button
                  key={icon.name}
                  variant={selectedIcon === icon.name ? "default" : "outline"}
                  className={`flex flex-col items-center p-3 h-auto ${
                    selectedIcon === icon.name ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => {
                    onSelectIcon(icon.name);
                    setIsOpen(false);
                  }}
                >
                  <icon.component size={24} className="mb-1" />
                  <span className="text-xs">{icon.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default IconSelector;
