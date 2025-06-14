
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useItems } from "@/context/ItemsContext";
import { useAuth } from "@/context/AuthContext";
import { Package, IndianRupee, MapPin, Tag, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const StashStats = () => {
  const { items } = useItems();
  const { user } = useAuth();
  const [showValue, setShowValue] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const activeItems = items.filter(item => !item.archived);
  
  // Get user's preferred currency or default to INR (Indian Rupees)
  const currency = user?.preferences?.currency || 'INR';
  
  // Calculate total value of items with prices
  const totalValue = activeItems.reduce((sum, item) => {
    if (item.price && !item.priceless) {
      return sum + (item.price * item.quantity);
    }
    return sum;
  }, 0);

  // Get unique locations
  const uniqueLocations = new Set(activeItems.map(item => item.location)).size;
  
  // Get unique tags
  const uniqueTags = new Set(activeItems.flatMap(item => item.tags)).size;

  // Format currency based on user preference with compact notation for large values
  const formatCurrency = (amount: number) => {
    const currencyConfig = {
      'INR': { locale: 'en-IN', currency: 'INR' },
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'en-DE', currency: 'EUR' }
    };

    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.INR;
    
    // Use compact notation for values over 1 million to prevent overflow
    const useCompact = amount >= 1000000;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: useCompact ? 1 : 2,
      notation: useCompact ? 'compact' : 'standard',
    }).format(amount);
  };

  const stats = [
    {
      title: "Items",
      value: activeItems.length,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Value",
      value: showValue ? formatCurrency(totalValue) : "•••",
      icon: IndianRupee,
      color: "text-green-600",
      hasToggle: true
    },
    {
      title: "Locations",
      value: uniqueLocations,
      icon: MapPin,
      color: "text-purple-600"
    },
    {
      title: "Tags",
      value: uniqueTags,
      icon: Tag,
      color: "text-orange-600"
    }
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Stats</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                  {stat.hasToggle && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setShowValue(!showValue)}
                    >
                      {showValue ? (
                        <Eye className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3 px-3">
                <div className="text-lg sm:text-xl font-bold truncate" title={typeof stat.value === 'string' ? stat.value : stat.value.toString()}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default StashStats;
