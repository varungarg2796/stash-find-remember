
import React from 'react';
import { ViewMode } from '@/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3X3, List } from 'lucide-react';
import { motion } from 'framer-motion';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle = ({ activeView, onViewChange }: ViewToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <ToggleGroup 
        type="single" 
        value={activeView} 
        onValueChange={(value) => value && onViewChange(value as ViewMode)}
        className="border border-purple-200 bg-white shadow-sm"
      >
        <ToggleGroupItem 
          value="grid" 
          aria-label="Grid view"
          className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 hover:bg-purple-50 transition-all duration-200"
        >
          <Grid3X3 size={18} />
          <span className="ml-2 text-sm font-medium hidden sm:inline">Grid</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="list" 
          aria-label="List view"
          className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 hover:bg-purple-50 transition-all duration-200"
        >
          <List size={18} />
          <span className="ml-2 text-sm font-medium hidden sm:inline">List</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </motion.div>
  );
};

export default ViewToggle;
