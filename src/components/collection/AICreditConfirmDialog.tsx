import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueryStatus } from '@/services/api/aiApi';
import { 
  Clock, 
  Zap, 
  AlertTriangle, 
  Sparkles,
  Calendar
} from 'lucide-react';

interface AICreditConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  queryStatus: QueryStatus | undefined;
  isLoading?: boolean;
}

const formatResetTime = (resetTime?: string) => {
  if (!resetTime) return 'Tomorrow';
  
  const resetDate = new Date(resetTime);
  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  
  if (diffHours <= 1) {
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'}`;
  } else {
    return resetDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export const AICreditConfirmDialog: React.FC<AICreditConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  queryStatus,
  isLoading = false,
}) => {
  console.log('AICreditConfirmDialog render:', { isOpen, queryStatus, isLoading });
  
  const remaining = queryStatus?.remaining || 0;
  const total = queryStatus?.total || 30;
  const resetTimeDisplay = formatResetTime(queryStatus?.resetTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>Generate AI Suggestions</span>
              <p className="text-sm font-normal text-gray-600 mt-1">
                This will use 1 AI credit from your daily allowance
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Credit Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">AI Credits</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {remaining}/{total} remaining
              </Badge>
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(remaining / total) * 100}%` }}
              />
            </div>
            
            <p className="text-sm text-blue-700">
              After this request: <span className="font-semibold">{remaining - 1}/{total}</span> credits remaining
            </p>
          </div>

          {/* Reset Information */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Credits reset in {resetTimeDisplay}</p>
              <p className="text-xs text-gray-600">You'll get {total} new credits when they reset</p>
            </div>
          </div>

          {/* Low credit warning */}
          {remaining <= 5 && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  {remaining <= 2 ? 'Very few credits remaining' : 'Running low on credits'}
                </p>
                <p className="text-xs text-amber-700">
                  Consider using them wisely until they reset
                </p>
              </div>
            </div>
          )}

          {/* What happens next */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="font-medium text-purple-900 mb-2">What happens next:</h4>
            <div className="space-y-1 text-sm text-purple-700">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>AI analyzes all your items and collections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Smart suggestions based on location, type, and patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Results cached for 24 hours (no additional credits)</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || remaining <= 0}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Use 1 Credit & Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};