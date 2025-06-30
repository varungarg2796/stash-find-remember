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
import { ArrowLeft, Settings, Share, Copy, Eye, Home } from 'lucide-react';
import { Collection, ShareSettings } from '@/types';
import { motion } from 'framer-motion';

interface CollectionHeaderProps {
  onBack: () => void;
  collection: Collection;
  onShareSettingsUpdate: (settings: Partial<ShareSettings>) => void; // It's a partial update
  onCopyShareLink: () => void;
  onPreviewSharedView: () => void;
}

const CollectionHeader = ({
  onBack,
  collection,
  onShareSettingsUpdate,
  onCopyShareLink,
  onPreviewSharedView,
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
    <motion.div 
      className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-50 shadow-sm"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back Button and Title */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 hover:bg-purple-100">
              <ArrowLeft size={20} />
            </Button>
            {/* Show breadcrumbs only on larger screens */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span className="text-purple-600 font-medium">Collections</span>
              <span>/</span>
              <span className="font-medium text-gray-900 max-w-[200px] truncate">{collection.name}</span>
            </div>
            {/* Show just collection name on mobile */}
            <div className="sm:hidden">
              <h1 className="font-semibold text-gray-900 truncate max-w-[200px]">{collection.name}</h1>
            </div>
          </div>
          
          {/* Right: Action Buttons - Responsive */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
                  <Settings className="h-4 w-4 sm:mr-2" /> 
                  <span className="hidden sm:inline">Share Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Share className="h-4 w-4 text-purple-600" />
                    </div>
                    Share Collection
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2 rounded-lg border border-purple-200 bg-purple-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-sharing" className="font-medium text-purple-900">Enable Public Sharing</Label>
                      <Switch
                        id="enable-sharing"
                        checked={localSettings.isEnabled}
                        onCheckedChange={handleSharingToggle}
                      />
                    </div>
                    <p className="text-xs text-purple-700">
                      Only people with the URL will be able to see this collection
                    </p>
                  </div>
                  
                  {localSettings.isEnabled && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-3">
                        <Label>Shareable Link</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={`${window.location.origin}/share/collection/${collection.shareSettings.shareId}`}
                            readOnly 
                            className="text-xs bg-gray-50"
                          />
                          <Button onClick={onCopyShareLink} size="icon" variant="outline" className="hover:bg-green-50">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Action buttons for all screen sizes */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button 
                            onClick={onCopyShareLink}
                            variant="secondary"
                            className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                          >
                            <Share className="h-4 w-4 mr-2" />
                            Copy Share Link
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsDialogOpen(false);
                              onPreviewSharedView();
                            }}
                            variant="outline"
                            className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Collection
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Visible Information</Label>
                        <div className="space-y-2 rounded-lg border p-3 bg-gray-50">
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
                    </motion.div>
                  )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleFinalUpdate} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                      Update Settings
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {collection.shareSettings.isEnabled && (
              <motion.div 
                className="hidden sm:flex gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  onClick={onCopyShareLink} 
                  size="sm" 
                  variant="secondary"
                  className="bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                  title="Copy share link"
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onPreviewSharedView} 
                  size="sm" 
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 text-blue-600"
                  title="Preview shared view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionHeader;