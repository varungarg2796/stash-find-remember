
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Hash } from "lucide-react";
import { useState } from "react";

interface QuantityInputProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

const QuantityInput = ({ quantity, onChange }: QuantityInputProps) => {
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    onChange(newQuantity);
    setInputValue(newQuantity.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };
  
  const handleInputFocus = () => {
    setIsEditing(true);
  };
  
  const handleInputBlur = () => {
    setIsEditing(false);
    // Ensure the input shows the current quantity if user entered invalid value
    if (inputValue === '' || parseInt(inputValue) <= 0 || isNaN(parseInt(inputValue))) {
      setInputValue(quantity.toString());
    }
  };
  

  return (
    <div>
      <div className="mb-1">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <Hash className="h-4 w-4" />
          Quantity
        </label>
        <p className="text-xs text-gray-500 mt-1">How many do you have?</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          type="button"
          variant="outline" 
          size="lg"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
          className="h-12 w-12 text-base sm:h-10 sm:w-10 sm:text-sm"
        >
          <Minus size={18} />
        </Button>
        
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="text-center text-lg font-medium h-12 sm:h-10 sm:text-base max-w-[80px] mx-2"
          inputMode="numeric"
        />
        
        <Button 
          type="button"
          variant="outline" 
          size="lg"
          onClick={() => handleQuantityChange(1)}
          className="h-12 w-12 text-base sm:h-10 sm:w-10 sm:text-sm"
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default QuantityInput;
