
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Item } from '@/types';
import { getTagColor } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { id, name, image, location, quantity, tags, description } = item;
  
  // Generate a placeholder image with the first letter of the item name
  const placeholderImage = `https://via.placeholder.com/150/6B7280/FFFFFF?text=${name.charAt(0)}`;
  
  // Limit description to 80 characters
  const truncatedDescription = description && description.length > 80 
    ? `${description.substring(0, 80)}...` 
    : description;

  return (
    <Link to={`/items/${id}`}>
      <Card className="card-hover h-full">
        <CardContent className="p-0">
          <div className="relative">
            <div className="w-full h-48 bg-gray-200 overflow-hidden">
              <img 
                src={image || placeholderImage} 
                alt={name}
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
            {quantity && quantity > 1 && (
              <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {quantity}x
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            {location && (
              <p className="text-sm text-gray-500 mb-2">
                {location}
              </p>
            )}
            {truncatedDescription && (
              <p className="text-sm text-gray-600 mb-3">
                {truncatedDescription}
              </p>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: getTagColor(tag) }}
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ItemCard;
