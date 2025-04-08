
import React from 'react';
import { ViewMode } from '@/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle = ({ activeView, onViewChange }: ViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && onViewChange(value as ViewMode)}>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <Grid size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List size={18} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
