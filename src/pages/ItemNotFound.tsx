
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorPage from "@/components/ErrorPage";
import { Package2, Plus } from "lucide-react";

const ItemNotFound = () => {
  const navigate = useNavigate();

  return (
    <ErrorPage
      errorCode="404"
      title="Item Not Found"
      description="The item you're looking for doesn't exist or may have been deleted."
      customActions={
        <div className="flex flex-col gap-2 w-full">
          <Button 
            variant="outline"
            onClick={() => navigate("/my-stash")}
            className="flex items-center gap-2"
          >
            <Package2 size={16} />
            View My Stash
          </Button>
          <Button 
            onClick={() => navigate("/add-item")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Item
          </Button>
        </div>
      }
    />
  );
};

export default ItemNotFound;
