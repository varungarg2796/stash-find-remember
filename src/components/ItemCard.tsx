
interface ItemProps {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
  quantity: number;
  onUse: (id: string) => void;
  onGift: (id: string) => void;
}

const ItemCard = ({ id, name, imageUrl, tags, quantity, onUse, onGift }: ItemProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden card-shadow">
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
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
        <p className="text-gray-600 mb-4">{quantity} quantity</p>
        <div className="flex justify-between gap-3">
          <button 
            className="action-button flex-1" 
            onClick={() => onUse(id)}
          >
            Use
          </button>
          <button 
            className="action-button flex-1" 
            onClick={() => onGift(id)}
          >
            Gift
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
