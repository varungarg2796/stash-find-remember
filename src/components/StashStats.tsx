import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Package, IndianRupee, MapPin, Tag, Eye, EyeOff, ChevronUp, ChevronDown, Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/services/api/statsApi';
import { useNavigate } from 'react-router-dom';
import { TagLocationManager } from '@/components/TagLocationManager';

const StashStats = () => {
  const { user } = useAuth(); // We still need the user for their currency preference
  const navigate = useNavigate();
  const [showValue, setShowValue] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerTab, setManagerTab] = useState<'tags' | 'locations'>('tags');
  
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

  const handleTagsClick = () => {
    setManagerTab('tags');
    setIsManagerOpen(true);
  };

  const handleLocationsClick = () => {
    setManagerTab('locations');
    setIsManagerOpen(true);
  };

  const stats = [
    { title: "Items", value: statsData.totalItems, icon: Package, color: "text-blue-600" },
    { title: "Value", value: showValue ? formatCurrency(statsData.totalValue) : "•••", icon: IndianRupee, color: "text-green-600", hasToggle: true },
    { title: "Locations", value: statsData.uniqueLocations, icon: MapPin, color: "text-purple-600", isClickable: true, onClick: handleLocationsClick },
    { title: "Tags", value: statsData.uniqueTags, icon: Tag, color: "text-orange-600", isClickable: true, onClick: handleTagsClick },
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
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-slate-200">
          <CardContent className="p-3">
            {/* Mobile: 2x2 Grid, Desktop: Horizontal Row */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2 min-w-0 sm:flex-1">
                  <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-slate-200/80`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground truncate">{stat.title}</div>
                    <div 
                      className={`font-bold text-sm truncate flex items-center gap-1 ${
                        stat.isClickable ? 'cursor-pointer hover:text-primary transition-colors' : ''
                      }`} 
                      title={stat.isClickable ? `Click to manage ${stat.title.toLowerCase()}` : String(stat.value)}
                      onClick={stat.onClick}
                    >
                      {stat.value}
                      {stat.hasToggle && (
                        <Button variant="ghost" size="icon" className="h-3 w-3 p-0 hover:bg-transparent" onClick={() => setShowValue(!showValue)}>
                          {showValue ? <Eye className="h-2.5 w-2.5 text-muted-foreground" /> : <EyeOff className="h-2.5 w-2.5 text-muted-foreground" />}
                        </Button>
                      )}
                      {stat.isClickable && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-3 w-3 p-0 hover:bg-transparent opacity-60 hover:opacity-100" 
                          onClick={(e) => {
                            e.stopPropagation();
                            stat.onClick?.();
                          }}
                          title={`Manage ${stat.title.toLowerCase()}`}
                        >
                          <Pencil className="h-2 w-2 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden sm:block h-8 w-px bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
      
      <TagLocationManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        initialTab={managerTab}
      />
    </Collapsible>
  );
};

export default StashStats;