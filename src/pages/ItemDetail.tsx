import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useItems } from '@/context/ItemsContext'; // For actions like archive, gift
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Edit, Trash2, Tag, MapPin,
  Heart, Gift, Archive,
  Calendar, ArchiveRestore, Loader2,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ItemHistory from '@/components/ItemHistory';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useItemQuery, useDeleteItemMutation } from '@/hooks/useItemsQuery';
import { getIconByName } from '@/utils/iconUtils';

const ItemDetailInner = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // --- DATA FETCHING ---
  const { data: item, isLoading, error } = useItemQuery(id!);

  // --- ACTIONS & MUTATIONS ---
  const { archiveItem, giftItem, restoreItem } = useItems();
  const deleteMutation = useDeleteItemMutation();

  // Format currency based on user preference
  const formatCurrency = (amount: number) => {
    const currency = user?.currency || 'INR';
    const currencyConfig = {
      'INR': { locale: 'en-IN', currency: 'INR' },
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'en-DE', currency: 'EUR' }
    };

    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.INR;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const [activeTab, setActiveTab] = useState('details');
  const [actionNote, setActionNote] = useState('');
  const [actionType, setActionType] = useState<'gift' | 'archive' | 'restore' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- HANDLERS ---
  const handleEdit = () => {
    const from = searchParams.get('from');
    const editUrl = from ? `/edit-item/${id}?from=${from}` : `/edit-item/${id}`;
    navigate(editUrl);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      deleteMutation.mutate(id!, {
        onSuccess: () => navigate('/my-stash'),
      });
    }
  };

  const openActionDialog = (type: 'gift' | 'archive' | 'restore') => {
    setActionType(type);
    setActionNote('');
    setIsDialogOpen(true);
  };

  const executeAction = () => {
    if (!actionType || !id) return;
    const params = { id, note: actionNote };

    switch (actionType) {
      case 'gift':
        giftItem(params); // <-- Change to pass object
        break;
      case 'archive':
        archiveItem(params); // <-- Change to pass object
        break;
      case 'restore':
        restoreItem(params); // <-- Change to pass object
        break;
    }
    setIsDialogOpen(false);
    if (actionType !== 'restore') {
      navigate('/my-stash');
    }
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error || !item) {
    return <ErrorDisplay title="Item Not Found" message="The item you are looking for does not exist or could not be loaded." />;
  }

  // UI Helper variables
  const IconComponent = getIconByName(item.iconType);
  
  const getColorForItem = (name: string): string => {
    const colors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-red-200", "bg-purple-200"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash) % colors.length];
  };
  const placeholderColor = getColorForItem(item.name);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        onClick={() => {
          const from = searchParams.get('from');
          if (from === 'collections') {
            navigate('/collections');
          } else {
            navigate(-1);
          }
        }} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2" size={18} /> Back
      </Button>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="bg-gray-50">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : IconComponent ? (
              <div className={`w-full h-full flex items-center justify-center ${placeholderColor}`}>
                <IconComponent size={120} className="text-gray-700 opacity-70" />
              </div>
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${placeholderColor} text-gray-700 text-6xl font-bold`}>
                {item.name.charAt(0).toUpperCase()}
              </div>
            )}
          </AspectRatio>
          
          {!item.archived && (
            <Button onClick={handleEdit} className="absolute top-4 right-4" size="sm">
              <Edit className="mr-2" size={16} /> Edit
            </Button>
          )}
          
          {item.priceless && (
            <div className="absolute top-4 left-4 bg-pink-100 text-pink-700 px-3 py-1 rounded-full flex items-center shadow-sm">
              <Heart className="mr-1" size={16} fill="currentColor" /> Priceless
            </div>
          )}
          
          {item.archived && (
            <div className="absolute bottom-0 inset-x-0 bg-gray-800/70 text-white py-2 px-4 flex items-center justify-center">
              <Archive className="mr-2" size={16} /> <span className="font-medium">Archived Item</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <div className="text-sm text-muted-foreground pt-2 flex-shrink-0 ml-4">
              Added {format(new Date(item.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
          
          {item.acquisitionDate && (
            <div className="mb-4 text-sm text-gray-600 flex items-center">
              <Calendar size={14} className="mr-2" />
              Acquired: {format(new Date(item.acquisitionDate), 'MMM d, yyyy')}
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <div className="mb-6"><h2 className="text-xl font-semibold mb-2">Description</h2><p className="text-gray-700">{item.description || "No description provided."}</p></div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span key={index} className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                    <Tag size={14} className="mr-1 text-gray-500" />{tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg"><h2 className="text-lg font-semibold mb-1">Quantity</h2><p className="text-2xl font-bold text-gray-800">{item.quantity}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><h2 className="text-lg font-semibold mb-1">Location</h2><p className="text-gray-700 flex items-center"><MapPin size={16} className="mr-1 text-gray-500" />{item.location || "Not specified"}</p></div>
                {((item.price && item.price > 0) || item.priceless) && (
                  <div className="bg-gray-50 p-4 rounded-lg col-span-1 sm:col-span-2"><h2 className="text-lg font-semibold mb-1">Value</h2>{item.priceless ? <p className="flex items-center text-pink-700"><Heart size={16} className="mr-1" fill="currentColor" />Priceless</p> : <p className="text-2xl font-bold text-gray-800">{formatCurrency(item.price!)}</p>}</div>
                )}
              </div>
              
              {item.archived ? (
                <Button onClick={() => openActionDialog('restore')} className="w-full mb-4"><ArchiveRestore className="mr-2" size={18} /> Restore Item</Button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Button variant="outline" onClick={() => openActionDialog('gift')}><Gift className="mr-2" size={18} /> Gift Item</Button>
                  <Button variant="outline" onClick={() => openActionDialog('archive')}><Archive className="mr-2" size={18} /> Archive</Button>
                </div>
              )}
              
              <div className="flex gap-4">
                <Button onClick={handleEdit} className="flex-1" variant="secondary"><Edit className="mr-2" size={18} /> Edit</Button>
                <Button onClick={handleDelete} className="flex-1" variant="destructive" disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2" size={18} />} Delete
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <ItemHistory item={item} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'gift' && 'Gift Item'}
              {actionType === 'archive' && 'Archive Item'}
              {actionType === 'restore' && 'Restore Item'}
            </DialogTitle>
            <DialogDescription>Add an optional note for your item's history.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea placeholder="e.g., Gifted to Jane for her birthday" value={actionNote} onChange={(e) => setActionNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={executeAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ItemDetail = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return <ItemDetailInner />;
};

export default ItemDetail;