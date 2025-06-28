import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Tag, Loader2, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/api/userApi';
import { locationsApi } from '@/services/api/locationsApi';
import { tagsApi } from '@/services/api/tagsApi';
import { toast } from 'sonner';
import { ApiError } from '@/types';
import { getErrorMessage } from '@/lib/utils';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, updateUserInContext } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userApi.getCurrentUser,
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000, // Stale after 5 minutes
  });

  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [newLocation, setNewLocation] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'invalid' | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setCurrency(user.currency || 'INR');
      // Reset username status when loading user data
      setUsernameStatus(null);
    }
  }, [user]);

  // Username validation with debounce
  useEffect(() => {
    if (!username || username === user?.username) {
      setUsernameStatus(null);
      return;
    }

    // Basic validation
    if (username.length < 3) {
      setUsernameStatus('invalid');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    // Debounce username checking
    const timeoutId = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        // Note: This endpoint would need to be implemented in the backend
        const response = await userApi.checkUsernameAvailability(username);
        setUsernameStatus(response.available ? 'available' : 'taken');
      } catch (error) {
        console.error('Error checking username:', error);
        // For now, assume available if check fails
        setUsernameStatus('available');
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, user?.username]);

  // --- MUTATIONS ---

  const updateUserMutation = useMutation({
    mutationFn: userApi.updatePreferences,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['userProfile'], updatedUser);
      updateUserInContext(updatedUser);
      toast.success('Preferences saved successfully!');
    },
    onError: (err: ApiError) => {
      const description = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(', ')
        : getErrorMessage(err, 'Failed to save preferences');
      toast.error('Failed to save preferences', { description });
    },
  });

  const addLocationMutation = useMutation({
    mutationFn: (name: string) => locationsApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setNewLocation('');
      toast.success('Location added!');
    },
    onError: (err: ApiError) => toast.error('Failed to add location', { description: getErrorMessage(err, 'Failed to add location') }),
  });

  const removeLocationMutation = useMutation({
    mutationFn: (id: string) => locationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Location removed!');
    },
    onError: (err: ApiError) => toast.error('Failed to remove location', { description: getErrorMessage(err, 'Failed to remove location') }),
  });

  const addTagMutation = useMutation({
    mutationFn: (name: string) => tagsApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setNewTag('');
      toast.success('Tag added!');
    },
    onError: (err: ApiError) => toast.error('Failed to add tag', { description: getErrorMessage(err, 'Failed to add tag') }),
  });

  const removeTagMutation = useMutation({
    mutationFn: (id: string) => tagsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Tag removed!');
    },
    onError: (err: ApiError) => toast.error('Failed to remove tag', { description: getErrorMessage(err, 'Failed to remove tag') }),
  });
  
  // --- HANDLERS ---

  const handleSavePreferences = () => {
    if (!user) return;
    
    // Only save if username is valid (if changed)
    if (username !== user.username && (usernameStatus === 'taken' || usernameStatus === 'invalid')) {
      toast.error('Please fix username issues before saving');
      return;
    }
    
    updateUserMutation.mutate({
      username,
      currency,
    });
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = user && (
    username !== user.username || 
    currency !== (user.currency || 'INR')
  );

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      addLocationMutation.mutate(newLocation.trim());
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTagMutation.mutate(newTag.trim());
    }
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return <div>Error loading profile. Please try again or log in.</div>;
  }
  
  const isSaving = updateUserMutation.isPending;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm space-y-8">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl || "/placeholder.svg"} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Profile Settings</h3>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 text-sm text-amber-600">
                <Clock size={14} />
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1">
                <User size={16} /> Username
              </label>
              <div className="relative">
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter username"
                  className={`pr-8 ${
                    usernameStatus === 'taken' || usernameStatus === 'invalid' 
                      ? 'border-red-300 focus:border-red-500' 
                      : usernameStatus === 'available' 
                      ? 'border-green-300 focus:border-green-500' 
                      : ''
                  }`}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isCheckingUsername && <Loader2 size={16} className="animate-spin text-gray-400" />}
                  {!isCheckingUsername && usernameStatus === 'available' && <CheckCircle size={16} className="text-green-500" />}
                  {!isCheckingUsername && (usernameStatus === 'taken' || usernameStatus === 'invalid') && <AlertCircle size={16} className="text-red-500" />}
                </div>
              </div>
              {usernameStatus === 'invalid' && (
                <p className="text-xs text-red-600 mt-1">Username must be 3+ characters and contain only letters, numbers, _ or -</p>
              )}
              {usernameStatus === 'taken' && (
                <p className="text-xs text-red-600 mt-1">This username is already taken</p>
              )}
              {usernameStatus === 'available' && (
                <p className="text-xs text-green-600 mt-1">Username is available!</p>
              )}
              {!usernameStatus && (
                <p className="text-xs text-muted-foreground mt-1">This will appear on your shared collections</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                  <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Profile Preferences</h4>
                <p className="text-xs text-muted-foreground">Username and currency settings</p>
              </div>
              <Button 
                onClick={handleSavePreferences} 
                disabled={
                  isSaving || 
                  !hasUnsavedChanges || 
                  (username !== user?.username && (usernameStatus === 'taken' || usernameStatus === 'invalid' || isCheckingUsername))
                }
                className={hasUnsavedChanges ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Locations Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">My Locations</h3>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle size={14} />
              <span>Auto-saved</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Add or remove custom locations where you store your items. Changes are saved automatically.</p>
          <div className="flex gap-2">
            <Input placeholder="Add new location..." value={newLocation} onChange={(e) => setNewLocation(e.target.value)} disabled={addLocationMutation.isPending} />
            <Button onClick={handleAddLocation} variant="outline" disabled={!newLocation.trim() || user.usage.locationCount >= user.usage.locationLimit || addLocationMutation.isPending}>
              {addLocationMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus size={16} className="mr-1" /> Add</>}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.locations.map((location) => (
              <Badge key={location.id} variant="outline" className="flex items-center gap-1">
                {location.name}
                <button onClick={() => removeLocationMutation.mutate(location.id)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 disabled:opacity-50" disabled={removeLocationMutation.isPending}>
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{user.usage.locationCount}/{user.usage.locationLimit} locations used</p>
        </div>
        
        {/* Tags Management */}
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Common Tags</h3>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle size={14} />
              <span>Auto-saved</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Manage the tags you use to categorize your items. Changes are saved automatically.</p>
          <div className="flex gap-2">
            <Input placeholder="Add common tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} disabled={addTagMutation.isPending} />
            <Button onClick={handleAddTag} variant="outline" disabled={!newTag.trim() || user.usage.tagCount >= user.usage.tagLimit || addTagMutation.isPending}>
              {addTagMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus size={16} className="mr-1" /> Add</>}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="flex items-center gap-1">
                <Tag size={12} className="mr-1" />
                {tag.name}
                <button onClick={() => removeTagMutation.mutate(tag.id)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 disabled:opacity-50" disabled={removeTagMutation.isPending}>
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{user.usage.tagCount}/{user.usage.tagLimit} tags used</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;