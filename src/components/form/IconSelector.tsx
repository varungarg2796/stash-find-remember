
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableIcons, getCategories, searchAndFilterIcons } from "@/utils/iconUtils";
import { X, Search } from "lucide-react";

interface IconSelectorProps {
  selectedIcon: string | null;
  onSelectIcon: (icon: string | null) => void;
}

const IconSelector = ({ selectedIcon, onSelectIcon }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Find the selected icon component
  const selectedIconData = availableIcons.find(icon => icon.name === selectedIcon);
  
  // Get categories and filtered icons
  const categories = getCategories();
  const filteredIcons = searchAndFilterIcons(searchQuery, selectedCategory);
  
  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };
  
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
          <PopoverContent 
            className="w-[95vw] max-w-[500px] p-3 sm:p-4 z-50 bg-white mx-2 sm:mx-0" 
            align="start"
            side="bottom"
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Search and Filter Controls */}
              <div className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search icons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReset}
                    className="text-xs w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500">
                  {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found
                </div>
              </div>
              
              {/* Icons Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[350px] overflow-y-auto">
                {filteredIcons.length > 0 ? (
                  filteredIcons.map((icon) => (
                    <Button
                      key={icon.name}
                      variant={selectedIcon === icon.name ? "default" : "outline"}
                      className={`flex flex-col items-center p-2 sm:p-3 h-auto transition-all duration-200 hover:shadow-md ${
                        selectedIcon === icon.name ? "bg-primary text-white shadow-lg" : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        onSelectIcon(icon.name);
                        setIsOpen(false);
                      }}
                      title={`${icon.label} - ${icon.category}`}
                    >
                      <icon.component size={18} className="mb-1 sm:mb-1 sm:w-5 sm:h-5" />
                      <span className="text-[10px] sm:text-xs text-center leading-tight line-clamp-2">
                        {icon.label}
                      </span>
                    </Button>
                  ))
                ) : (
                  <div className="col-span-3 sm:col-span-4 md:col-span-5 text-center py-6 sm:py-8 text-gray-500">
                    <Search className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mb-2" />
                    <p className="text-sm">No icons found</p>
                    <p className="text-xs">Try adjusting your search or filter</p>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default IconSelector;
