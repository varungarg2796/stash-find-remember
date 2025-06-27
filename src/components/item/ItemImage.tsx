import { Package } from "lucide-react";
import { getIconByName } from "@/utils/iconUtils";

interface ItemImageProps {
  item: {
    imageUrl?: string;
    iconType?: string;
    name: string;
  };
  className?: string;
  iconSize?: string;
  fallbackIconSize?: string;
}

const ItemImage = ({ 
  item, 
  className = "w-full h-full object-cover rounded-t-lg", 
  iconSize = "h-16 w-16",
  fallbackIconSize = "h-16 w-16"
}: ItemImageProps) => {
  const IconComponent = getIconByName(item.iconType);
  
  if (item.imageUrl) {
    return (
      <img 
        src={item.imageUrl} 
        alt={item.name}
        className={className}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    );
  } else if (IconComponent) {
    return (
      <div className={`${className.replace('object-cover', '')} bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center`}>
        <IconComponent className={`${iconSize} text-slate-600`} />
      </div>
    );
  } else {
    return (
      <div className={`${className.replace('object-cover', '')} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
        <Package className={`${fallbackIconSize} text-slate-400`} />
      </div>
    );
  }
};

export default ItemImage;