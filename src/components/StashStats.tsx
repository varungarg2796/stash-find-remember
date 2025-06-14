
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useItems } from "@/context/ItemsContext";
import { useAuth } from "@/context/AuthContext";
import { Package, DollarSign, MapPin, Tag, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const StashStats = () => {
  const { items } = useItems();
  const { user } = useAuth();
  const [showValue, setShowValue] = useState(true);
  const activeItems = items.filter(item => !item.archived);
  
  // Get user's preferred currency or default to USD
  const currency = user?.preferences?.currency || 'USD';
  
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

  // Format currency based on user preference
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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
      icon: DollarSign,
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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
            <div className="text-lg sm:text-xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StashStats;
