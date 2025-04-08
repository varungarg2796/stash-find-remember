
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Tag, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "recharts";

const Stats = () => {
  const { items } = useItems();
  const navigate = useNavigate();

  // Calculate basic statistics
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueLocations = [...new Set(items.map(item => item.location))].filter(Boolean).length;
  const uniqueTags = [...new Set(items.flatMap(item => item.tags))].length;
  
  // For a real app, we'd use actual price data
  // For this POC, we'll generate random prices if not available
  const totalValue = items.reduce((sum, item) => {
    const price = item.price || Math.floor(Math.random() * 100) + 1; // Random price between 1-100
    return sum + (price * item.quantity);
  }, 0);

  // Prepare data for location chart
  const locationData = items.reduce((acc: Record<string, number>, item) => {
    const location = item.location || "Unspecified";
    acc[location] = (acc[location] || 0) + item.quantity;
    return acc;
  }, {});

  const locationChartData = Object.entries(locationData).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare data for tag distribution
  const tagDistribution = items.flatMap(item => item.tags).reduce((acc: Record<string, number>, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const tagChartData = Object.entries(tagDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Stash Statistics</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{totalItems}</span>
              <Package size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Total quantity: {totalQuantity}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Locations</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{uniqueLocations}</span>
              <MapPin size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Unique storage places</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tags</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{uniqueTags}</span>
              <Tag size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Unique categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Value</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">${totalValue}</span>
              <DollarSign size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Items by Location</CardTitle>
            <CardDescription>Distribution of items across locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
            <CardDescription>Most frequently used tags</CardDescription>
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
                    dataKey="value"
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
