
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Settings, Share, Copy } from "lucide-react";
import { toast } from "sonner";
import { Collection, ShareSettings } from "@/types";

interface CollectionHeaderProps {
  onBack: () => void;
  collection: Collection;
  shareSettings: ShareSettings | undefined;
  setShareSettings: (settings: ShareSettings | undefined) => void;
  onShareSettingsUpdate: () => void;
  onCopyShareLink: () => void;
}

const CollectionHeader = ({
  onBack,
  collection,
  shareSettings,
  setShareSettings,
  onShareSettingsUpdate,
  onCopyShareLink
}: CollectionHeaderProps) => {
  const handleSharingToggle = (checked: boolean) => {
    if (shareSettings) {
      setShareSettings({ ...shareSettings, isEnabled: checked });
    }
  };

  const handleDisplaySettingChange = (key: string, checked: boolean) => {
    if (shareSettings) {
      setShareSettings({
        ...shareSettings,
        displaySettings: { ...shareSettings.displaySettings, [key]: checked }
      });
    }
  };

  return (
    <div className="sticky top-0 bg-background border-b z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="animate-scale-in">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-4 animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Share Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-sharing"
                      checked={shareSettings?.isEnabled || false}
                      onCheckedChange={handleSharingToggle}
                    />
                    <Label htmlFor="enable-sharing">Enable Public Sharing</Label>
                  </div>
                  
                  {shareSettings?.isEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Share Link</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={`${window.location.origin}/share/collection/${shareSettings.shareId}`}
                            readOnly 
                            className="text-xs"
                          />
                          <Button onClick={onCopyShareLink} size="icon" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Visible Information</Label>
                        <div className="space-y-2">
                          {Object.entries(shareSettings.displaySettings).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Switch
                                checked={value}
                                onCheckedChange={(checked) => handleDisplaySettingChange(key, checked)}
                              />
                              <Label className="text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button onClick={onShareSettingsUpdate} className="w-full">
                    Update Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {collection.shareSettings.isEnabled && (
              <Button onClick={onCopyShareLink} size="sm">
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
