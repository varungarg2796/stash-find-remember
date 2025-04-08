
import { Link } from "react-router-dom";
import { Item } from "@/types";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const { id, name, imageUrl, tags, quantity, location } = item;
  
  return (
    <Link to={`/items/${id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden card-shadow">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-4xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-semibold mb-2">{name}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="item-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Qty: {quantity}</p>
            <p className="text-gray-600 text-sm">{location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
