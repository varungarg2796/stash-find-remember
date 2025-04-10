
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import ItemList from "@/components/ItemList";
import { ArrowLeft, Box, RefreshCw } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Archive = () => {
  const { getArchivedItems, restoreItem } = useItems();
  const navigate = useNavigate();
  const archivedItems = getArchivedItems();
  const [sortBy, setSortBy] = useState<string>("newest");
  
  const sortedItems = [...archivedItems].sort((a, b) => {
    const archiveActions = (item: any) => {
      return item.history?.find((h: any) => h.action === "archived")?.date || new Date();
    };
    
    const dateA = archiveActions(a);
    const dateB = archiveActions(b);
    
    if (sortBy === "newest") {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    } else {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    }
  });

  const handleRestore = (id: string) => {
    restoreItem(id);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center">
            <Box className="mr-2" />
            Archive
          </h1>
          <p className="text-muted-foreground text-sm">Items that have been used, gifted, or archived</p>
        </div>
      </div>

      {archivedItems.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {archivedItems.length} archived item{archivedItems.length !== 1 ? 's' : ''}
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <ItemList 
              items={sortedItems} 
              isArchive={true}
              onRestore={handleRestore}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Box size={40} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">Your archive is empty</h3>
          <p className="text-muted-foreground mb-4">
            Items that you use, gift, or archive will appear here
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return to items
          </Button>
        </div>
      )}
    </div>
  );
};

export default Archive;
