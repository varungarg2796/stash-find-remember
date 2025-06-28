import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, MapPin, Tag, DollarSign, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/services/api/statsApi'; // We created this earlier
import ErrorDisplay from '@/components/ErrorDisplay';
import { useAuth } from '@/context/AuthContext';

const Stats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch stats data directly from the backend
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: statsApi.getDashboardStats,
  });

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-6">
        <ErrorDisplay title="Could Not Load Stats" message="There was an error fetching your statistics." />
      </div>
    );
  }
  
  // The backend now provides the data pre-calculated
  const totalItems = stats.totalItems;
  const totalValue = stats.totalValue;
  const uniqueLocations = stats.uniqueLocations;
  const uniqueTags = stats.uniqueTags;
  const locationChartData = stats.locationDistribution;
  const tagChartData = stats.tagDistribution;
  
  // Dynamic currency formatting based on user preference
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
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Stash Statistics</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Items</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{totalItems}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Locations</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{uniqueLocations}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tags</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{uniqueTags}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Value</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{formatCurrency(totalValue)}</div></CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Items by Location</CardTitle>
            <CardDescription>Top 5 locations with the most items.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
            <CardDescription>Distribution of your top 5 most used tags.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {tagChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;