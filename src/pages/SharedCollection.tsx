import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, DollarSign, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ViewToggle from '@/components/ViewToggle';
import { ViewMode } from '@/types';
import { useSharedCollectionQuery } from '@/hooks/useShareCollectionQuery';
import ErrorDisplay from '@/components/ErrorDisplay';
import { PublicCollectionItem } from '@/services/api/shareApi'; // <-- Import the specific type

const SharedCollection = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const { data: collection, isLoading, error } = useSharedCollectionQuery(shareId!);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !collection) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-10">
        <ErrorDisplay
          title="Collection Not Found"
          message="This collection may no longer be shared or the link might be incorrect."
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-screen-lg mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{collection.description}</p>
          )}
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="outline">{collection.items.length} item{collection.items.length !== 1 ? 's' : ''}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-1.5" /> by {collection.by}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {collection.items.length === 0 ? (
          <div className="text-center my-12"><p className="text-muted-foreground">This collection is empty.</p></div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ViewToggle 
                activeView={viewMode}
                onViewChange={handleViewModeChange}
              />
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collection.items.map((item: PublicCollectionItem) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.imageUrl && (
                      <div className="relative aspect-square bg-muted">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader><CardTitle>{item.name}</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {item.description && <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>}
                      {item.collectionNote && <p className="text-sm italic bg-muted p-2 rounded-md">"{item.collectionNote}"</p>}
                      <div className="space-y-1 pt-2">
                        {item.quantity && item.quantity > 1 && <div className="text-sm flex items-center text-muted-foreground"><span className="font-medium mr-2 w-28">Quantity:</span> {item.quantity}</div>}
                        {item.location && <div className="text-sm flex items-center text-muted-foreground"><MapPin className="h-3 w-3 mr-1.5" />{item.location}</div>}
                        {item.price && <div className="text-sm flex items-center text-muted-foreground"><DollarSign className="h-3 w-3 mr-1.5" />{item.price}</div>}
                        {item.acquisitionDate && <div className="text-sm flex items-center text-muted-foreground"><Calendar className="h-3 w-3 mr-1.5" />Acquired: {format(new Date(item.acquisitionDate), 'MMM d, yyyy')}</div>}
                      </div>
                    </CardContent>
                    {item.tags && item.tags.length > 0 && (
                      <CardFooter className="flex flex-wrap gap-1 pt-2 border-t mt-2">
                        {item.tags.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {collection.items.map((item: PublicCollectionItem) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">{item.name}</h3>
                        {item.description && <p className="text-sm text-muted-foreground truncate mt-1">{item.description}</p>}
                        {item.collectionNote && <p className="text-sm text-muted-foreground italic truncate mt-1">"{item.collectionNote}"</p>}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          {item.quantity && item.quantity > 1 && <span>Qty: {item.quantity}</span>}
                          {item.location && <span><MapPin className="h-3 w-3 inline mr-1" />{item.location}</span>}
                          {item.price && <span><DollarSign className="h-3 w-3 inline mr-1" />{item.price}</span>}
                          {item.acquisitionDate && <span><Calendar className="h-3 w-3 inline mr-1" />{format(new Date(item.acquisitionDate), 'MMM d, yyyy')}</span>}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="text-center text-xs text-muted-foreground mt-12">Shared collection • Powered by Stasher</div>
      </div>
    </div>
  );
};

export default SharedCollection;