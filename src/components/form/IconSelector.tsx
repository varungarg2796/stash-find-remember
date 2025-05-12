
import { useState } from "react";
import { 
  Book, Armchair, Monitor, Laptop, 
  Tv, Gift, Heart, Image as ImageIcon, 
  Shirt, Camera 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";

const icons = [
  { name: "book", component: Book, label: "Book" },
  { name: "armchair", component: Armchair, label: "Furniture" },
  { name: "monitor", component: Monitor, label: "Monitor" },
  { name: "laptop", component: Laptop, label: "Laptop" },
  { name: "tv", component: Tv, label: "TV" },
  { name: "gift", component: Gift, label: "Gift" },
  { name: "heart", component: Heart, label: "Heart" },
  { name: "image", component: ImageIcon, label: "Image" },
  { name: "camera", component: Camera, label: "Camera" }
];

interface IconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (icon: string) => void;
}

const IconSelector = ({ selectedIcon, onSelectIcon }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the selected icon component
  const selectedIconData = icons.find(icon => icon.name === selectedIcon);
  
  return (
    <div className="my-4">
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Choose an Icon
        </label>
      </div>
      
      <div className="flex gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {selectedIconData ? (
                <>
                  <selectedIconData.component size={16} />
                  <span>{selectedIconData.label}</span>
                </>
              ) : (
                "Select Icon"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 z-50 bg-white" align="start">
            <div className="grid grid-cols-3 gap-2">
              {icons.map((icon) => (
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
