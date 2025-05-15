
import { useState, useEffect } from 'react';
import { useItems } from '@/context/ItemsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Package, MapPin, Tag, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const StashStats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useItems();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    totalQuantity: 0,
    uniqueLocations: 0,
    uniqueTags: 0,
    totalValue: 0
  });

  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : 
                        user?.preferences?.currency === 'GBP' ? '£' : 
                        user?.preferences?.currency === 'JPY' ? '¥' : '$';

  useEffect(() => {
    // Only active (non-archived) items
    const activeItems = items.filter(item => !item.archived);
    
    const totalItems = activeItems.length;
    const totalQuantity = activeItems.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueLocations = [...new Set(activeItems.map(item => item.location))].filter(Boolean).length;
    const uniqueTags = [...new Set(activeItems.flatMap(item => item.tags))].length;
    
    // Calculate total value
    const totalValue = activeItems.reduce((sum, item) => {
      if (item.priceless) return sum;
      return sum + ((item.price || 0) * item.quantity);
    }, 0);

    setStats({ totalItems, totalQuantity, uniqueLocations, uniqueTags, totalValue });
  }, [items]);

  // If there are no items, don't render the component
  if (stats.totalItems === 0) return null;

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="mb-6"
    >
      <Card className="overflow-hidden border border-gray-200">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-all">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-700">Quick Statistics</h3>
            <div className="flex ml-4 space-x-3">
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center">
                <Package size={12} className="mr-1" />
                {stats.totalItems} items
              </span>
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full flex items-center">
                <DollarSign size={12} className="mr-1" />
                {currencySymbol}{stats.totalValue.toLocaleString()}
              </span>
            </div>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-4 pt-3 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col border rounded-lg p-3 bg-blue-50">
                <span className="text-sm text-gray-500 font-medium flex items-center">
                  <Package size={14} className="mr-1 text-blue-600" />
                  Items
                </span>
                <div className="mt-1">
                  <span className="text-xl font-bold text-blue-700">{stats.totalItems}</span>
                  <span className="text-sm text-gray-500 ml-1">({stats.totalQuantity} total)</span>
                </div>
              </div>

              <div className="flex flex-col border rounded-lg p-3 bg-green-50">
                <span className="text-sm text-gray-500 font-medium flex items-center">
                  <MapPin size={14} className="mr-1 text-green-600" />
                  Locations
                </span>
                <div className="mt-1">
                  <span className="text-xl font-bold text-green-700">{stats.uniqueLocations}</span>
                </div>
              </div>

              <div className="flex flex-col border rounded-lg p-3 bg-amber-50">
                <span className="text-sm text-gray-500 font-medium flex items-center">
                  <Tag size={14} className="mr-1 text-amber-600" />
                  Categories
                </span>
                <div className="mt-1">
                  <span className="text-xl font-bold text-amber-700">{stats.uniqueTags}</span>
                </div>
              </div>

              <div className="flex flex-col border rounded-lg p-3 bg-purple-50">
                <span className="text-sm text-gray-500 font-medium flex items-center">
                  <DollarSign size={14} className="mr-1 text-purple-600" />
                  Value
                </span>
                <div className="mt-1">
                  <span className="text-xl font-bold text-purple-700">
                    {currencySymbol}{stats.totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <a href="/stats" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                View detailed statistics →
              </a>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default StashStats;
