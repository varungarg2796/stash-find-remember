
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCollections } from "@/context/CollectionsContext";
import { useItems } from "@/context/ItemsContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Tag, MapPin, DollarSign, Clock, User } from "lucide-react";
import { format } from "date-fns";
import ViewToggle from "@/components/ViewToggle";
import { ViewMode } from "@/types";

const SharedCollection = () => {
  const { shareId } = useParams();
  const { getSharedCollection } = useCollections();
  const { items } = useItems();
  const [collection, setCollection] = useState(getSharedCollection(shareId!));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    let isMounted = true;
    
    const updateCollection = () => {
      if (isMounted) {
        setCollection(getSharedCollection(shareId!));
      }
    };
    
    updateCollection();
    
    return () => {
      isMounted = false;
    };
  }, [shareId, getSharedCollection]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const collectionItems = useMemo(() => {
    if (!collection) return [];
    
    return collection.items.map(collectionItem => {
      const item = items.find(i => i.id === collectionItem.itemId);
      return item ? { ...item, collectionNote: collectionItem.collectionNote } : null;
    }).filter(Boolean);
  }, [collection, items]);

  const shareSettings = useMemo(() => {
    if (!collection) return null;
    return collection.shareSettings.displaySettings;
  }, [collection]);

  if (!collection) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="text-muted-foreground">
            This collection may no longer be shared or the link might be incorrect.
          </p>
        </div>
      </div>
    );
  }

  const {
    showDescription, showQuantity, showLocation,
    showTags, showPrice, showAcquisitionDate
  } = shareSettings!;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
        {collection.description && (
          <p className="text-muted-foreground">{collection.description}</p>
        )}
        <div className="mt-3 flex items-center justify-center gap-4">
          <Badge variant="secondary">
            {collectionItems.length} item{collectionItems.length !== 1 ? 's' : ''}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-1" />
            <span>by {collection.by}</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {collectionItems.length === 0 ? (
        <div className="text-center my-12">
          <p className="text-muted-foreground">This collection is empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <ViewToggle 
              activeView={viewMode}
              onViewChange={handleViewModeChange}
            />
          </div>
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectionItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    {showDescription && item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    
                    {item.collectionNote && (
                      <div className="bg-secondary/50 p-2 rounded-md text-sm italic">
                        "{item.collectionNote}"
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      {showQuantity && item.quantity > 1 && (
                        <div className="text-sm flex items-center text-muted-foreground">
                          <span className="font-medium mr-2">Quantity:</span> {item.quantity}
                        </div>
                      )}
                      
                      {showLocation && item.location && (
                        <div className="text-sm flex items-center text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      
                      {showPrice && item.price && (
                        <div className="text-sm flex items-center text-muted-foreground">
                          <DollarSign className="h-3 w-3 mr-1" />
                          <span>${item.price}</span>
                        </div>
                      )}
                      
                      {showAcquisitionDate && item.acquisitionDate && (
                        <div className="text-sm flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{format(new Date(item.acquisitionDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  {showTags && item.tags && item.tags.length > 0 && (
                    <CardFooter className="flex flex-wrap gap-1 pt-0">
                      {item.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {collectionItems.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate">{item.name}</h3>
                        {showDescription && item.description && (
                          <p className="text-sm text-muted-foreground truncate mt-1">{item.description}</p>
                        )}
                        {item.collectionNote && (
                          <p className="text-sm text-muted-foreground italic truncate mt-1">"{item.collectionNote}"</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                          {showQuantity && item.quantity > 1 && (
                            <span>Qty: {item.quantity}</span>
                          )}
                          {showLocation && item.location && (
                            <span><MapPin className="h-3 w-3 inline mr-1" />{item.location}</span>
                          )}
                          {showPrice && item.price && (
                            <span><DollarSign className="h-3 w-3 inline mr-1" />${item.price}</span>
                          )}
                          {showAcquisitionDate && item.acquisitionDate && (
                            <span><Calendar className="h-3 w-3 inline mr-1" />{format(new Date(item.acquisitionDate), 'MMM d, yyyy')}</span>
                          )}
                        </div>
                        
                        {showTags && item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground mt-10">
        Shared collection • Powered by Stasher
      </div>
    </div>
  );
};

export default SharedCollection;
