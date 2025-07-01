import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aiApi, CollectionSuggestion, QueryStatus } from '@/services/api/aiApi';
import { collectionsApi } from '@/services/api/collectionsApi';
import { SuggestionCard } from './SuggestionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Clock,
  Loader2,
  Zap,
  FolderOpen,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CollectionSuggestions: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<CollectionSuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [hasEverTriggered, setHasEverTriggered] = useState(false); // Track if user has ever clicked the button
  const [creatingCollections, setCreatingCollections] = useState<Set<string>>(new Set()); // Track which collections are being created
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch query status
  const { data: queryStatus } = useQuery<QueryStatus>({
    queryKey: ['ai-query-status'],
    queryFn: aiApi.getQueryStatus,
    refetchInterval: 60000,
  });

  const visibleSuggestions = suggestions.filter(
    suggestion => !dismissedSuggestions.has(`${suggestion.name}-${suggestion.suggestedBy}`)
  );

  const handleGenerateSuggestions = async () => {
    console.log('Generate suggestions clicked');
    
    if (!queryStatus || queryStatus.remaining <= 0) {
      toast({
        title: "No AI queries remaining",
        description: "You've reached your daily AI limit. Try again tomorrow.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setHasEverTriggered(true); // Mark that user has tried to get suggestions
    
    try {
      console.log('Making API call to get suggestions...');
      const response = await aiApi.getCollectionSuggestions(5);
      console.log('API response:', response);
      
      // Add a small delay to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuggestions(response.suggestions);
      setDismissedSuggestions(new Set());
      
      // Invalidate query status to refresh the remaining count
      queryClient.invalidateQueries({ queryKey: ['ai-query-status'] });
      
      toast({
        title: "Suggestions generated!",
        description: `Found ${response.suggestions.length} suggestions. Used 1 AI query`,
      });
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast({
        title: "Failed to get suggestions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCollection = async (suggestion: CollectionSuggestion) => {
    const suggestionKey = `${suggestion.name}-${suggestion.suggestedBy}`;
    
    try {
      // Add to creating set
      setCreatingCollections(prev => new Set([...prev, suggestionKey]));
      
      const newCollection = await collectionsApi.create({
        name: suggestion.name,
        description: suggestion.description,
      });

      for (const itemId of suggestion.itemIds) {
        try {
          await collectionsApi.addItem(newCollection.id, itemId);
        } catch (itemError) {
          console.warn(`Failed to add item ${itemId} to collection:`, itemError);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['collections'] });
      
      toast({
        title: "Collection created!",
        description: `"${suggestion.name}" collection has been created with ${suggestion.itemIds.length} items.`,
      });

      handleDismissSuggestion(suggestion);
    } catch (error) {
      console.error('Failed to create collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove from creating set
      setCreatingCollections(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestionKey);
        return newSet;
      });
    }
  };

  const handleDismissSuggestion = (suggestion: CollectionSuggestion) => {
    const suggestionKey = `${suggestion.name}-${suggestion.suggestedBy}`;
    setDismissedSuggestions(prev => new Set([...prev, suggestionKey]));
  };

  // No query quota available
  if (queryStatus && queryStatus.remaining <= 0) {
    return (
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-900">Daily AI limit reached</h3>
              <p className="text-sm text-amber-700">
                AI suggestions will be available after your daily quota resets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state when generating
  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generating Smart Suggestions</h2>
                <p className="text-sm text-gray-600">AI is analyzing your items...</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            <motion.div 
              className="flex items-center justify-center gap-3 py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <div className="text-center">
                <p className="text-gray-700 font-medium text-lg mb-2">Analyzing your items...</p>
                <p className="text-gray-500 text-sm">This may take a few moments</p>
              </div>
            </motion.div>
            
            {/* Animated progress bar */}
            <div className="w-full bg-purple-200 rounded-full h-2 mb-4">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Creating intelligent collection suggestions based on your items
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show zero results state
  if (suggestions.length > 0 && visibleSuggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">All suggestions dismissed!</h3>
                <p className="text-blue-700 mb-4">
                  You've dismissed all the current suggestions. Try adding more items for fresh AI insights.
                </p>
              </div>
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isGenerating || !queryStatus || queryStatus.remaining <= 0}
                variant="outline"
                className="border-blue-300 hover:border-blue-500 hover:bg-blue-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate New Suggestions
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show zero API results state - ONLY if user has actually tried to get suggestions
  if (hasEverTriggered && suggestions.length === 0 && !isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">No new suggestions found</h3>
                <p className="text-amber-700 mb-4">
                  AI analyzed your items but couldn't find any new collection opportunities right now. This could mean your items are already well-organized!
                </p>
                <div className="text-sm text-amber-600 bg-amber-100 rounded-lg p-3 mx-auto max-w-md mb-4">
                  💡 <strong>Pro tip:</strong> Try adding more items, or come back later as AI suggestions improve over time!
                </div>
                {queryStatus && (
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {queryStatus.remaining}/{queryStatus.total} AI queries left today
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Try again costs 1 credit</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isGenerating || !queryStatus || queryStatus.remaining <= 0}
                variant="outline"
                className="border-amber-300 hover:border-amber-500 hover:bg-amber-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show suggestions if we have them
  if (visibleSuggestions.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Smart Collection Suggestions</h2>
                    <p className="text-sm text-gray-600">AI-powered organization ideas • More items = smarter suggestions! 🧠</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {queryStatus && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{queryStatus.remaining}/{queryStatus.total} queries left</span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleGenerateSuggestions} 
                    variant="outline" 
                    size="sm"
                    disabled={isGenerating || !queryStatus || queryStatus.remaining <= 0}
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{visibleSuggestions.length} suggestions available</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {visibleSuggestions.map((suggestion, index) => {
              const suggestionKey = `${suggestion.name}-${suggestion.suggestedBy}`;
              const isCreating = creatingCollections.has(suggestionKey);
              
              return (
                <motion.div
                  key={`${suggestion.name}-${suggestion.suggestedBy}-${index}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: 'easeOut'
                  }}
                >
                  <SuggestionCard
                    suggestion={suggestion}
                    onCreateCollection={handleCreateCollection}
                    onDismiss={handleDismissSuggestion}
                    isCreating={isCreating}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  // Initial state - show the main button
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get AI Collection Suggestions</h3>
              <p className="text-gray-600 mb-4">
                Let AI analyze your items and suggest smart collections to help organize your inventory.
              </p>
              <div className="text-sm text-purple-600 bg-purple-100 rounded-lg p-3 mb-4 mx-auto max-w-md">
                {queryStatus && queryStatus.remaining === queryStatus.total ? (
                  // First time user - more welcoming message
                  <>✨ <strong>Welcome!</strong> Add some items to your inventory, then let AI suggest the perfect collections to organize them.</>
                ) : (
                  // Returning user - tip about more items
                  <>🎯 <strong>Smart tip:</strong> AI gets better with more items! 10+ items unlock the most creative suggestions.</>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {queryStatus ? `${queryStatus.remaining}/${queryStatus.total}` : '—'} AI queries left
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Uses 1 AI credit</span>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleGenerateSuggestions}
                disabled={!queryStatus || queryStatus.remaining <= 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get Smart Suggestions
              </Button>
            </motion.div>
            
            {(!queryStatus || queryStatus.remaining <= 0) && (
              <motion.p 
                className="text-sm text-amber-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Daily AI limit reached. Suggestions will be available tomorrow.
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};