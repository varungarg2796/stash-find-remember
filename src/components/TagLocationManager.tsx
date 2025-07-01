import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { tagsApi } from '@/services/api/tagsApi';
import { locationsApi } from '@/services/api/locationsApi';
import { itemsApi } from '@/services/api/itemsApi';
import { userApi } from '@/services/api/userApi';
import { toast } from 'sonner';

interface TagLocationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'tags' | 'locations';
}

export const TagLocationManager: React.FC<TagLocationManagerProps> = ({
  isOpen,
  onClose,
  initialTab = 'tags'
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [newTag, setNewTag] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'tag' | 'location';
    item: { id: string; name: string } | null;
  }>({ isOpen: false, type: 'tag', item: null });

  // Query to get fresh user data (this will update in real-time)
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userApi.getCurrentUser,
    enabled: isOpen, // Only fetch when modal is open
  });

  // Query to get all items for usage validation
  const { data: allItems } = useQuery({
    queryKey: ['allItems'],
    queryFn: () => itemsApi.getAll({ limit: 1000 }), // Get a large number to check usage
    enabled: isOpen, // Only fetch when modal is open
  });

  // Use fresh user data instead of context
  const user = userData;

  // Tag mutations with optimistic updates
  const addTagMutation = useMutation({
    mutationFn: (name: string) => tagsApi.create(name),
    onMutate: async (name: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      
      // Snapshot the previous value
      const previousUserData = queryClient.getQueryData(['userProfile']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['userProfile'], (old: any) => ({
        ...old,
        tags: [...(old?.tags || []), { id: `temp-${Date.now()}`, name }]
      }));
      
      return { previousUserData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Tag added successfully!');
      setNewTag('');
    },
    onError: (error: any, _variables, context) => {
      // Rollback on error
      if (context?.previousUserData) {
        queryClient.setQueryData(['userProfile'], context.previousUserData);
      }
      toast.error(error.message || 'Failed to add tag');
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagsApi.remove(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      
      // Snapshot the previous value
      const previousUserData = queryClient.getQueryData(['userProfile']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['userProfile'], (old: any) => ({
        ...old,
        tags: old?.tags?.filter((tag: any) => tag.id !== id) || []
      }));
      
      return { previousUserData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Tag deleted successfully!');
    },
    onError: (error: any, _variables, context) => {
      // Rollback on error
      if (context?.previousUserData) {
        queryClient.setQueryData(['userProfile'], context.previousUserData);
      }
      toast.error(error.message || 'Failed to delete tag');
    },
  });

  // Location mutations with optimistic updates
  const addLocationMutation = useMutation({
    mutationFn: (name: string) => locationsApi.create(name),
    onMutate: async (name: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      
      // Snapshot the previous value
      const previousUserData = queryClient.getQueryData(['userProfile']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['userProfile'], (old: any) => ({
        ...old,
        locations: [...(old?.locations || []), { id: `temp-${Date.now()}`, name }]
      }));
      
      return { previousUserData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Location added successfully!');
      setNewLocation('');
    },
    onError: (error: any, _variables, context) => {
      // Rollback on error
      if (context?.previousUserData) {
        queryClient.setQueryData(['userProfile'], context.previousUserData);
      }
      toast.error(error.message || 'Failed to add location');
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (id: string) => locationsApi.remove(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      
      // Snapshot the previous value
      const previousUserData = queryClient.getQueryData(['userProfile']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['userProfile'], (old: any) => ({
        ...old,
        locations: old?.locations?.filter((location: any) => location.id !== id) || []
      }));
      
      return { previousUserData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Location deleted successfully!');
    },
    onError: (error: any, _variables, context) => {
      // Rollback on error
      if (context?.previousUserData) {
        queryClient.setQueryData(['userProfile'], context.previousUserData);
      }
      toast.error(error.message || 'Failed to delete location');
    },
  });

  // Helper functions to check usage
  const getTagUsage = (tagName: string) => {
    if (!allItems?.items) return { count: 0, items: [] };
    const usedItems = allItems.items.filter(item => item.tags?.includes(tagName));
    return { count: usedItems.length, items: usedItems };
  };

  const getLocationUsage = (locationName: string) => {
    if (!allItems?.items) return { count: 0, items: [] };
    const usedItems = allItems.items.filter(item => item.location === locationName);
    return { count: usedItems.length, items: usedItems };
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const currentTagCount = user?.tags?.length || 0;
    if (currentTagCount >= 20) {
      toast.error('You can only have up to 20 tags. Please delete some tags before adding new ones.');
      return;
    }
    
    addTagMutation.mutate(newTag.trim());
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    
    const currentLocationCount = user?.locations?.length || 0;
    if (currentLocationCount >= 20) {
      toast.error('You can only have up to 20 locations. Please delete some locations before adding new ones.');
      return;
    }
    
    addLocationMutation.mutate(newLocation.trim());
  };

  const handleDeleteTag = (tagId: string) => {
    const tag = user?.tags?.find(t => t.id === tagId);
    if (!tag) return;

    const usage = getTagUsage(tag.name);
    if (usage.count > 0) {
      const itemsList = usage.items.slice(0, 3).map(item => `"${item.name}"`).join(', ');
      const moreText = usage.count > 3 ? ` and ${usage.count - 3} more` : '';
      toast.error(
        `Cannot delete "${tag.name}" - it's used by ${usage.count} item${usage.count === 1 ? '' : 's'}: ${itemsList}${moreText}. Remove the tag from these items first.`
      );
      return;
    }

    setDeleteConfirm({
      isOpen: true,
      type: 'tag',
      item: tag
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    const location = user?.locations?.find(l => l.id === locationId);
    if (!location) return;

    const usage = getLocationUsage(location.name);
    if (usage.count > 0) {
      const itemsList = usage.items.slice(0, 3).map(item => `"${item.name}"`).join(', ');
      const moreText = usage.count > 3 ? ` and ${usage.count - 3} more` : '';
      toast.error(
        `Cannot delete "${location.name}" - it's used by ${usage.count} item${usage.count === 1 ? '' : 's'}: ${itemsList}${moreText}. Move these items first.`
      );
      return;
    }

    setDeleteConfirm({
      isOpen: true,
      type: 'location',
      item: location
    });
  };

  const confirmDelete = () => {
    if (!deleteConfirm.item) return;
    
    if (deleteConfirm.type === 'tag') {
      deleteTagMutation.mutate(deleteConfirm.item.id);
    } else {
      deleteLocationMutation.mutate(deleteConfirm.item.id);
    }
    
    setDeleteConfirm({ isOpen: false, type: 'tag', item: null });
  };

  const handleGoToProfile = () => {
    onClose();
    navigate('/profile');
  };

  if (userLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[600px]">
          <DialogHeader>
            <DialogTitle>
              Quick Tag & Location Management
            </DialogTitle>
          </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'tags' | 'locations')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tags">
              Tags ({user?.tags?.length || 0}/20)
            </TabsTrigger>
            <TabsTrigger value="locations">
              Locations ({user?.locations?.length || 0}/20)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tags" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={
                  (user?.tags?.length || 0) >= 20 
                    ? "Maximum 20 tags reached" 
                    : "Add new tag..."
                }
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                disabled={addTagMutation.isPending || (user?.tags?.length || 0) >= 20}
              />
              <Button 
                onClick={handleAddTag} 
                size="sm"
                disabled={addTagMutation.isPending || !newTag.trim() || (user?.tags?.length || 0) >= 20}
              >
                {addTagMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {user?.tags?.map((tag) => {
                const usage = getTagUsage(tag.name);
                const isInUse = usage.count > 0;
                
                return (
                  <div key={tag.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{tag.name}</Badge>
                      {isInUse && (
                        <span className="text-xs text-muted-foreground">
                          ({usage.count} item{usage.count === 1 ? '' : 's'})
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDeleteTag(tag.id)}
                      size="sm"
                      variant="ghost"
                      className={`${isInUse ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`}
                      disabled={deleteTagMutation.isPending}
                      title={isInUse ? `Used by ${usage.count} item${usage.count === 1 ? '' : 's'}` : 'Delete tag'}
                    >
                      {deleteTagMutation.isPending ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                );
              })}
              {(!user?.tags || user.tags.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No tags yet. Add your first tag above!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={
                  (user?.locations?.length || 0) >= 20 
                    ? "Maximum 20 locations reached" 
                    : "Add new location..."
                }
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                disabled={addLocationMutation.isPending || (user?.locations?.length || 0) >= 20}
              />
              <Button 
                onClick={handleAddLocation} 
                size="sm"
                disabled={addLocationMutation.isPending || !newLocation.trim() || (user?.locations?.length || 0) >= 20}
              >
                {addLocationMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {user?.locations?.map((location) => {
                const usage = getLocationUsage(location.name);
                const isInUse = usage.count > 0;
                
                return (
                  <div key={location.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{location.name}</Badge>
                      {isInUse && (
                        <span className="text-xs text-muted-foreground">
                          ({usage.count} item{usage.count === 1 ? '' : 's'})
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDeleteLocation(location.id)}
                      size="sm"
                      variant="ghost"
                      className={`${isInUse ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`}
                      disabled={deleteLocationMutation.isPending}
                      title={isInUse ? `Used by ${usage.count} item${usage.count === 1 ? '' : 's'}` : 'Delete location'}
                    >
                      {deleteLocationMutation.isPending ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                );
              })}
              {(!user?.locations || user.locations.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No locations yet. Add your first location above!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => !open && setDeleteConfirm({ isOpen: false, type: 'tag', item: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteConfirm.type === 'tag' ? 'Tag' : 'Location'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm.item?.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};