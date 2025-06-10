
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useItems } from "@/context/ItemsContext";
import { useAuth } from "@/context/AuthContext";
import { Package, DollarSign, MapPin, Tag } from "lucide-react";

const StashStats = () => {
  const { items } = useItems();
  const { user } = useAuth();
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
      title: "Total Items",
      value: activeItems.reduce((sum, item) => sum + item.quantity, 0),
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Locations",
      value: uniqueLocations,
      icon: MapPin,
      color: "text-purple-600"
    },
    {
      title: "Categories",
      value: uniqueTags,
      icon: Tag,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StashStats;
