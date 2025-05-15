
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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-800">Quick Statistics</h3>
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
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
