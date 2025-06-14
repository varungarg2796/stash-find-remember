
import { MapPin, Tag, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/types";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface ItemCardDetailsProps {
  item: Item;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

const ItemCardDetails = ({ item, isExpired, isExpiringSoon }: ItemCardDetailsProps) => {
  const { user } = useAuth();
  const currency = user?.preferences?.currency || 'INR';

  // Format currency based on user preference
  const formatCurrency = (amount: number) => {
    const currencyConfig = {
      'INR': { locale: 'en-IN', currency: 'INR' },
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'en-DE', currency: 'EUR' }
    };

    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.INR;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      {/* Location */}
      {item.location && (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>
      )}

      {/* Expiry Date */}
      {item.expiryDate && (
        <div className={`flex items-center text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-muted-foreground'}`}>
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">
            {isExpired ? 'Expired' : 'Expires'} {format(item.expiryDate, "MMM d, yyyy")}
          </span>
        </div>
      )}

      {/* Acquisition Date */}
      {item.acquisitionDate && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Added {format(item.acquisitionDate, "MMM d, yyyy")}</span>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex items-start gap-1 flex-wrap">
          <Tag className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex gap-1 flex-wrap">
            {item.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Price */}
      {item.price && !item.priceless && (
        <div className="text-sm font-medium text-green-600">
          {formatCurrency(item.price)}
        </div>
      )}
      {item.priceless && (
        <div className="text-sm font-medium text-purple-600">
          Priceless
        </div>
      )}
    </>
  );
};

export default ItemCardDetails;
