
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

const ErrorDisplay = ({ 
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Try Again",
  className = ""
}: ErrorDisplayProps) => {
  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardContent className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {retryText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
