
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface QuantityInputProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

const QuantityInput = ({ quantity, onChange }: QuantityInputProps) => {
  const handleQuantityChange = (amount: number) => {
    onChange(Math.max(1, quantity + amount));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onChange(value);
    }
  };

  return (
    <div>
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
        Quantity
      </label>
      <div className="flex items-center">
        <Button 
          type="button"
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <Minus size={18} />
        </Button>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={handleInputChange}
          className="mx-2 text-center"
        />
        <Button 
          type="button"
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(1)}
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default QuantityInput;
