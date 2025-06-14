
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorPage from "@/components/ErrorPage";
import { Package } from "lucide-react";

const CollectionNotFound = () => {
  const navigate = useNavigate();

  return (
    <ErrorPage
      errorCode="404"
      title="Collection Not Found"
      description="The collection you're looking for doesn't exist or may have been deleted."
      customActions={
        <Button 
          variant="outline"
          onClick={() => navigate("/collections")}
          className="flex items-center gap-2 w-full"
        >
          <Package size={16} />
          Browse Collections
        </Button>
      }
    />
  );
};

export default CollectionNotFound;
