import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Loader2, 
  Brain, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Eye,
  Plus
} from 'lucide-react';
import { useAnalysisStatusQuery, useImageAnalysisMutation, getTimeUntilReset } from '@/hooks/useImageAnalysis';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface ImageAnalysisProps {
  imageFile: File | null;
  onAnalysisStart?: () => void;
  onAnalysisResult: (result: { name: string; tags: string[] }) => void;
  onApplyName?: (name: string) => void;
  onApplyTags?: (tags: string[]) => void;
  className?: string;
}

const ImageAnalysis = ({ imageFile, onAnalysisStart, onAnalysisResult, onApplyName, onApplyTags, className }: ImageAnalysisProps) => {
  const { user } = useAuth();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<{ name: string; tags: string[] } | null>(null);
  const [appliedName, setAppliedName] = useState(false);
  const [appliedTags, setAppliedTags] = useState(false);
  
  const { data: analysisStatus, refetch: refetchStatus } = useAnalysisStatusQuery(!!user);
  const analysisMutation = useImageAnalysisMutation();

  const canAnalyze = imageFile && (analysisStatus?.remaining || 0) > 0 && !hasAnalyzed;
  const isQuotaExhausted = (analysisStatus?.remaining || 0) <= 0;

  const handleAnalyze = async (e?: React.MouseEvent) => {
    // Prevent any event propagation that might trigger form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!imageFile || !canAnalyze) return;

    // Notify parent that analysis is starting
    onAnalysisStart?.();

    try {
      const result = await analysisMutation.mutateAsync(imageFile);
      setLastAnalysisResult(result);
      onAnalysisResult(result);
      setHasAnalyzed(true);
      refetchStatus();
    } catch (error) {
      // Error is already handled by the mutation's onError
      refetchStatus();
    }
  };

  // Reset analysis state when image changes
  useEffect(() => {
    setHasAnalyzed(false);
    setLastAnalysisResult(null);
    setAppliedName(false);
    setAppliedTags(false);
  }, [imageFile]);

  const handleApplyName = () => {
    if (lastAnalysisResult && onApplyName) {
      onApplyName(lastAnalysisResult.name);
      setAppliedName(true);
    }
  };

  const handleApplyTags = () => {
    if (lastAnalysisResult && onApplyTags) {
      onApplyTags(lastAnalysisResult.tags);
      setAppliedTags(true);
    }
  };

  if (!user || !analysisStatus) {
    return null;
  }

  return (
    <Card className={cn("bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          AI Image Analysis
          <Badge className="bg-purple-100 text-purple-700 text-xs ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Status Display */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              analysisStatus.remaining > 2 ? "bg-green-100 text-green-700" :
              analysisStatus.remaining > 0 ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            )}>
              {analysisStatus.remaining}/{analysisStatus.total} analyses left
            </div>
            
            {isQuotaExhausted && analysisStatus.resetTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Resets in {getTimeUntilReset(analysisStatus.resetTime)}
              </div>
            )}
          </div>
        </div>

        {/* Analysis Action */}
        {!imageFile ? (
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Upload an image first to analyze it with AI and get smart suggestions for name and tags.
            </AlertDescription>
          </Alert>
        ) : hasAnalyzed && lastAnalysisResult ? (
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-700">
                Analysis complete! Apply the suggestions you want to use.
              </AlertDescription>
            </Alert>
            
            {/* AI Suggestions Display */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                AI Suggestions:
              </div>
              
              <div className="space-y-3">
                {/* Suggested Name */}
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-gray-900 break-words flex-1">{lastAnalysisResult.name}</div>
                      <Button
                        type="button"
                        size="sm"
                        variant={appliedName ? "default" : "outline"}
                        onClick={handleApplyName}
                        disabled={appliedName}
                        className={cn(
                          "h-7 px-2 text-xs flex-shrink-0",
                          appliedName 
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                            : "hover:bg-blue-50 hover:border-blue-300"
                        )}
                      >
                        {appliedName ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Apply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Suggested Tags */}
                {lastAnalysisResult.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tags ({lastAnalysisResult.tags.length})</div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-1 flex-1">
                          {lastAnalysisResult.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={appliedTags ? "default" : "outline"}
                          onClick={handleApplyTags}
                          disabled={appliedTags}
                          className={cn(
                            "h-7 px-2 text-xs flex-shrink-0",
                            appliedTags 
                              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" 
                              : "hover:bg-purple-50 hover:border-purple-300"
                          )}
                        >
                          {appliedTags ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Apply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : isQuotaExhausted ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You've reached your daily limit. Your analyses will reset {analysisStatus?.resetTime ? `in ${getTimeUntilReset(analysisStatus.resetTime)}` : 'tomorrow'}.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="mb-2">🧠 AI will analyze your image and suggest:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Smart item name</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Relevant tags</span>
                </div>
              </div>
            </div>
            
            <Button 
              type="button"
              onClick={handleAnalyze}
              disabled={!canAnalyze || analysisMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
              size="sm"
            >
              {analysisMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageAnalysis;