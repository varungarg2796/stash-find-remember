
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorPage from "@/components/ErrorPage";
import { Shield, LogIn } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <ErrorPage
      errorCode="403"
      title="Access Denied"
      description="You don't have permission to access this resource. Please log in or contact support if you think this is an error."
      customActions={
        <Button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 w-full"
        >
          <LogIn size={16} />
          Sign In
        </Button>
      }
    />
  );
};

export default AccessDenied;
