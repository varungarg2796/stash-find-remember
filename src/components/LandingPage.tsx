import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  Search,
  ArrowRight,
  Box,
  Sparkles,
  FolderOpen,
  Settings,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '@/services/api/itemsApi'; // We'll need to create collectionsApi
import { collectionsApi } from '@/services/api/collectionsApi';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Fetch data only when the user is logged in
  const { data: itemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: ['landingPageItems'],
    queryFn: () => itemsApi.getAll({ limit: 1 }), // Fetch a small amount of data just to get a count
    enabled: !!user,
  });

  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['landingPageCollections'],
    queryFn: () => collectionsApi.getAll(),
    enabled: !!user,
  });

  const handleLogin = () => {
    setIsLoggingIn(true);
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const isLoading = isLoadingItems || isLoadingCollections;
  
  // Use optional chaining with a nullish coalescing operator for safety
  const itemCount = itemsData?.data?.length ?? 0;
  const collectionCount = collectionsData?.length ?? 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
              Organize with
              <span className="block font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simplicity
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Keep track of your belongings in the most elegant way possible.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            {user ? (
              <>
                <Button onClick={() => navigate('/add-item')} size="lg">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
                <Button onClick={() => navigate('/my-stash')} variant="outline" size="lg">
                  <Box className="mr-2 h-4 w-4" /> My Stash
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} size="lg" disabled={isLoggingIn}>
                {isLoggingIn ? 'Redirecting...' : 'Get Started'}
                {!isLoggingIn && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-16">
            <Card className="bg-white/50 border-0 shadow-sm"><CardContent className="p-6 text-center"><div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="h-5 w-5 text-gray-600" /></div><h3 className="font-medium text-gray-900 mb-2">Smart Search</h3><p className="text-sm text-gray-600">Find anything instantly.</p></CardContent></Card>
            <Card className="bg-white/50 border-0 shadow-sm"><CardContent className="p-6 text-center"><div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="h-5 w-5 text-gray-600" /></div><h3 className="font-medium text-gray-900 mb-2">Effortless</h3><p className="text-sm text-gray-600">Intuitive and beautiful design.</p></CardContent></Card>
          </div>

          {/* User-specific content when logged in */}
          {user && (
            <div className="mt-16 space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-6"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <>
                  <div className="p-6 bg-white/60 rounded-2xl border border-gray-200 max-w-lg mx-auto">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Welcome back, {user.name.split(' ')[0]}</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {itemCount > 0 ? `You have ${itemCount} item(s) in your stash.` : 'Ready to add your first item?'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/my-stash')}>
                      <CardHeader className="pb-3"><CardTitle className="flex items-center justify-between text-lg"><div className="flex items-center gap-2"><Box className="h-5 w-5" /><span>My Stash</span></div><ChevronRight className="h-4 w-4" /></CardTitle></CardHeader>
                      <CardContent className="pt-0"><p className="text-sm text-muted-foreground">{itemCount} items organized</p></CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/collections')}>
                      <CardHeader className="pb-3"><CardTitle className="flex items-center justify-between text-lg"><div className="flex items-center gap-2"><FolderOpen className="h-5 w-5" /><span>Collections</span></div><ChevronRight className="h-4 w-4" /></CardTitle></CardHeader>
                      <CardContent className="pt-0"><p className="text-sm text-muted-foreground">{collectionCount} collections created</p></CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/profile')}>
                      <CardHeader className="pb-3"><CardTitle className="flex items-center justify-between text-lg"><div className="flex items-center gap-2"><Settings className="h-5 w-5" /><span>Settings</span></div><ChevronRight className="h-4 w-4" /></CardTitle></CardHeader>
                      <CardContent className="pt-0"><p className="text-sm text-muted-foreground">Configure preferences</p></CardContent>
                    </Card>
                  </div>

                  {itemCount === 0 && (
                    <Card className="max-w-lg mx-auto border-amber-200 bg-amber-50/50">
                      <CardContent className="p-6 text-center">
                        <Settings className="mx-auto h-8 w-8 text-amber-600 mb-3" />
                        <h3 className="font-medium text-amber-900 mb-2">Configure Your Stash</h3>
                        <p className="text-sm text-amber-700 mb-4">Set up your profile to get the most out of Stasher.</p>
                        <Button onClick={() => navigate('/profile')} variant="outline" size="sm">
                          <Settings className="mr-2 h-3 w-3" /> Go to Profile
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;