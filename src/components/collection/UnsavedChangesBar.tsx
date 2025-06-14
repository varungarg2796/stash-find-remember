
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface UnsavedChangesBarProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

const UnsavedChangesBar = ({ hasUnsavedChanges, onSave, onDiscard }: UnsavedChangesBarProps) => {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-orange-800">
          <Save className="h-4 w-4 mr-2" />
          You have unsaved changes
        </div>
        <div className="flex gap-2">
          <Button onClick={onDiscard} variant="outline" size="sm">
            Discard
          </Button>
          <Button onClick={onSave} size="sm">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesBar;
