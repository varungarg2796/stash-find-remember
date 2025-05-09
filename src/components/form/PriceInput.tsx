
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface PriceInputProps {
  price?: number;
  priceless: boolean;
  onPriceChange: (price?: number) => void;
  onPricelessToggle: (isPriceless: boolean) => void;
}

const PriceInput = ({ 
  price, 
  priceless, 
  onPriceChange, 
  onPricelessToggle 
}: PriceInputProps) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onPriceChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart size={18} className="text-pink-500" />
          <Label htmlFor="priceless" className="font-medium text-gray-700">
            Priceless (Sentimental Value)
          </Label>
        </div>
        <Switch 
          id="priceless" 
          checked={priceless}
          onCheckedChange={onPricelessToggle}
        />
      </div>
      
      {!priceless && (
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (optional)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={price || ""}
            onChange={handlePriceChange}
            placeholder="Enter item value"
          />
        </div>
      )}
    </div>
  );
};

export default PriceInput;
