import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Settings, Share, Copy } from 'lucide-react';
import { Collection, ShareSettings } from '@/types';

interface CollectionHeaderProps {
  onBack: () => void;
  collection: Collection;
  onShareSettingsUpdate: (settings: Partial<ShareSettings>) => void; // It's a partial update
  onCopyShareLink: () => void;
}

const CollectionHeader = ({
  onBack,
  collection,
  onShareSettingsUpdate,
  onCopyShareLink,
}: CollectionHeaderProps) => {
  const [localSettings, setLocalSettings] = useState<ShareSettings>(collection.shareSettings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (collection.shareSettings) {
        setLocalSettings(collection.shareSettings);
    }
  }, [collection.shareSettings]);

  const handleSharingToggle = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, isEnabled: checked }));
  };

  const handleDisplaySettingChange = (key: string, checked: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      displaySettings: {
        showDescription: prev.displaySettings?.showDescription ?? false,
        showQuantity: prev.displaySettings?.showQuantity ?? false,
        showLocation: prev.displaySettings?.showLocation ?? false,
        showTags: prev.displaySettings?.showTags ?? false,
        showPrice: prev.displaySettings?.showPrice ?? false,
        showAcquisitionDate: prev.displaySettings?.showAcquisitionDate ?? false,
        [key]: checked,
      },
    }));
  };

  const handleFinalUpdate = () => {
    // --- THIS IS THE FIX ---
    // Create a new object containing only the fields that are allowed in the DTO.
    const settingsToUpdate = {
      isEnabled: localSettings.isEnabled,
      displaySettings: localSettings.displaySettings,
    };
    // ----------------------

    onShareSettingsUpdate(settingsToUpdate);
    setIsDialogOpen(false);
  };

  if (!collection.shareSettings) {
      // Don't render the share button if settings don't exist
      return (
          <div className="sticky top-0 bg-background border-b z-10">
              <div className="px-4 py-3"><Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft size={18} /></Button></div>
          </div>
      )
  }

  return (
    <div className="sticky top-0 bg-background border-b z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
          
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" /> Share
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Share Collection</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="enable-sharing" className="font-medium">Enable Public Sharing</Label>
                    <Switch
                      id="enable-sharing"
                      checked={localSettings.isEnabled}
                      onCheckedChange={handleSharingToggle}
                    />
                  </div>
                  
                  {localSettings.isEnabled && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="space-y-2">
                        <Label>Shareable Link</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={`${window.location.origin}/share/collection/${collection.shareSettings.shareId}`}
                            readOnly 
                            className="text-xs"
                          />
                          <Button onClick={onCopyShareLink} size="icon" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label>Visible Information</Label>
                        <div className="space-y-2 rounded-lg border p-3">
                          {localSettings.displaySettings && Object.entries(localSettings.displaySettings).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <Label htmlFor={`display-${key}`} className="text-sm font-normal capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Label>
                              <Switch
                                id={`display-${key}`}
                                checked={value}
                                onCheckedChange={(checked) => handleDisplaySettingChange(key, checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleFinalUpdate}>Update Settings</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {collection.shareSettings.isEnabled && (
              <Button onClick={onCopyShareLink} size="sm" variant="secondary">
                <Share className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;