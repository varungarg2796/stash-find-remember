import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CollectionSuggestion } from '@/services/api/aiApi';
import { CollectionConflictModal } from './CollectionConflictModal';
import { 
  Plus, 
  Eye, 
  X, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  RotateCcw,
  Lightbulb,
  FolderOpen,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface SuggestionCardProps {
  suggestion: CollectionSuggestion;
  onCreateCollection: (suggestion: CollectionSuggestion) => void;
  onDismiss: (suggestion: CollectionSuggestion) => void;
  isCreating?: boolean;
}

const getSuggestionIcon = (type: CollectionSuggestion['suggestedBy']) => {
  switch (type) {
    case 'location':
      return <MapPin className="h-4 w-4" />;
    case 'price':
      return <DollarSign className="h-4 w-4" />;
    case 'gemini':
      return <Sparkles className="h-4 w-4" />;
    case 'pattern':
      return <RotateCcw className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getSuggestionTypeLabel = (type: CollectionSuggestion['suggestedBy']) => {
  switch (type) {
    case 'location':
      return 'Based on location';
    case 'price':
      return 'Based on price range';
    case 'gemini':
      return 'AI-powered suggestion';
    case 'pattern':
      return 'Smart organization';
    default:
      return 'Suggestion';
  }
};

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 0.8) {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Strong</Badge>;
  } else if (confidence >= 0.6) {
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
  } else {
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Helpful</Badge>;
  }
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onCreateCollection,
  onDismiss,
  isCreating = false
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  
  const alreadyCollected = suggestion.itemsAlreadyInCollections || [];
  const newItems = suggestion.itemIds.length - alreadyCollected.length;
  const hasConflicts = alreadyCollected.length > 0;
  
  const handleCreateClick = () => {
    if (hasConflicts) {
      setIsConflictModalOpen(true);
    } else {
      onCreateCollection(suggestion);
    }
  };
  
  const handleCreateAnyway = () => {
    setIsConflictModalOpen(false);
    onCreateCollection(suggestion);
  };
  
  const handleCancelCreate = () => {
    setIsConflictModalOpen(false);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {suggestion.name}
            </h3>
            {getConfidenceBadge(suggestion.confidence)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(suggestion)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getSuggestionIcon(suggestion.suggestedBy)}
          <span>{getSuggestionTypeLabel(suggestion.suggestedBy)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4">
          {suggestion.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{suggestion.itemIds.length} items</span>
            <span>•</span>
            <span>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
          </div>
          
          {/* Collection overlap indicators */}
          {hasConflicts && (
            <div className="flex items-center gap-2">
              {newItems > 0 && (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  +{newItems} new items
                </Badge>
              )}
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                <FolderOpen className="h-3 w-3 mr-1" />
                {alreadyCollected.length} in other collections
              </Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCreateClick}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </>
            )}
          </Button>
          
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{suggestion.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {suggestion.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Items to include:</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {suggestion.itemNames.map((itemName, index) => {
                      const itemId = suggestion.itemIds[index];
                      const isAlreadyCollected = alreadyCollected.find(
                        item => item.itemId === itemId
                      );
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isAlreadyCollected ? 'bg-blue-400' : 'bg-purple-400'
                            }`}></div>
                            <span className="text-sm">{itemName}</span>
                          </div>
                          {isAlreadyCollected && (
                            <Badge variant="outline" className="text-xs">
                              In {isAlreadyCollected.existingCollections[0]?.name}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                  {getSuggestionIcon(suggestion.suggestedBy)}
                  <span className="text-sm text-gray-600">
                    {getSuggestionTypeLabel(suggestion.suggestedBy)}
                  </span>
                  <div className="ml-auto">
                    {getConfidenceBadge(suggestion.confidence)}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Collection Conflict Modal */}
        <CollectionConflictModal
          suggestion={suggestion}
          isOpen={isConflictModalOpen}
          onClose={() => setIsConflictModalOpen(false)}
          onCreateAnyway={handleCreateAnyway}
          onCancel={handleCancelCreate}
        />
      </CardContent>
    </Card>
  );
};