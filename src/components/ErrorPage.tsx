
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  title: string;
  description: string;
  errorCode?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  customActions?: React.ReactNode;
}

const ErrorPage = ({
  title,
  description,
  errorCode,
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = false,
  onRefresh,
  customActions
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardContent className="text-center py-8">
          {errorCode && (
            <div className="text-6xl font-bold text-gray-300 mb-4">
              {errorCode}
            </div>
          )}
          
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <div className="text-2xl">😞</div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          
          <div className="flex flex-col gap-3">
            {customActions}
            
            <div className="flex gap-2 justify-center">
              {showBackButton && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <Home size={16} />
                  Home
                </Button>
              )}
              
              {showRefreshButton && onRefresh && (
                <Button 
                  variant="outline"
                  onClick={onRefresh}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
