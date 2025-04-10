
import { Item, ItemHistory as ItemHistoryType } from "@/types";
import { format } from "date-fns";
import { Calendar, Edit, Archive, RefreshCw, Gift, Activity } from "lucide-react";

interface ItemHistoryProps {
  item: Item;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'created':
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'updated':
      return <Edit className="h-4 w-4 text-amber-500" />;
    case 'used':
      return <Activity className="h-4 w-4 text-green-500" />;
    case 'gifted':
      return <Gift className="h-4 w-4 text-purple-500" />;
    case 'archived':
      return <Archive className="h-4 w-4 text-gray-500" />;
    default:
      return <Edit className="h-4 w-4 text-gray-500" />;
  }
};

const getActionText = (history: ItemHistoryType) => {
  switch (history.action) {
    case 'created':
      return 'Created';
    case 'updated':
      return 'Updated';
    case 'used':
      return 'Used';
    case 'gifted':
      return 'Gifted';
    case 'archived':
      return 'Archived';
    default:
      return 'Modified';
  }
};

const ItemHistory = ({ item }: ItemHistoryProps) => {
  if (!item.history || item.history.length === 0) {
    return <p className="text-sm text-gray-500">No history available</p>;
  }

  // Sort history by date, newest first
  const sortedHistory = [...item.history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Calendar className="mr-2" size={18} />
        Item History
      </h3>
      
      <div className="space-y-2">
        {sortedHistory.map((history) => (
          <div 
            key={history.id} 
            className="flex items-start p-3 border border-gray-100 rounded-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50">
              {getActionIcon(history.action)}
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">
                  {getActionText(history)}
                </span>
                <time className="text-xs text-gray-500">
                  {format(new Date(history.date), 'MMM d, yyyy h:mm a')}
                </time>
              </div>
              
              {history.note && (
                <p className="text-sm text-gray-600 mt-1">{history.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemHistory;
