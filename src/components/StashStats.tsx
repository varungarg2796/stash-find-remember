import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Package, IndianRupee, MapPin, Tag, Eye, EyeOff, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/services/api/statsApi'; // Import the new API service

const StashStats = () => {
  const { user } = useAuth(); // We still need the user for their currency preference
  const [showValue, setShowValue] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Use TanStack Query to fetch the stats data
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: statsApi.getDashboardStats,
    enabled: !!user, // Only fetch if the user is logged in
    staleTime: 5 * 60 * 1000, // Stats don't need to be refetched constantly
  });

  const currency = user?.currency || 'INR';
  
  const formatCurrency = (amount: number) => {
    const currencyConfig = {
      'INR': { locale: 'en-IN', currency: 'INR' },
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'en-DE', currency: 'EUR' },
    };
    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.INR;
    return new Intl.NumberFormat(config.locale, {
      style: 'currency', currency: config.currency, notation: 'compact'
    }).format(amount);
  };
  
  // If loading, show a skeleton or simplified loading state
  if (isLoading) {
    return (
      <div className="mb-4 p-4 border rounded-lg flex items-center justify-center bg-muted/50">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground text-sm">Loading stats...</span>
      </div>
    );
  }
  
  // If there's no data after loading (e.g., error or empty), don't render anything
  if (!statsData) {
    return null;
  }

  const stats = [
    { title: "Items", value: statsData.totalItems, icon: Package, color: "text-blue-600" },
    { title: "Value", value: showValue ? formatCurrency(statsData.totalValue) : "•••", icon: IndianRupee, color: "text-green-600", hasToggle: true },
    { title: "Locations", value: statsData.uniqueLocations, icon: MapPin, color: "text-purple-600" },
    { title: "Tags", value: statsData.uniqueTags, icon: Tag, color: "text-orange-600" },
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Stats</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                  {stat.hasToggle && (
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => setShowValue(!showValue)}>
                      {showValue ? <Eye className="h-3 w-3 text-muted-foreground" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3 px-3">
                <div className="text-lg sm:text-xl font-bold truncate" title={String(stat.value)}>
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