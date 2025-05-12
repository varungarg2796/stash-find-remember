
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  location: string;
  tags: string;
  price?: number;
  hasErrors?: boolean;
  errors?: {
    name?: string;
    quantity?: string;
    tags?: string;
    price?: string;
  };
}

interface BulkImportRowProps {
  row: RowItem;
  locations: string[];
  onUpdate: (id: string, field: keyof RowItem, value: any) => void;
  onDelete: (id: string) => void;
  validateRow?: (row: RowItem) => RowItem;
}

const BulkImportRow = ({ row, locations, onUpdate, onDelete, validateRow }: BulkImportRowProps) => {
  const { user } = useAuth();
  
  // Common tags from user preferences or default ones
  const commonTags = user?.preferences?.tags || [
    "Clothing", "Book", "Electronics", "Furniture", "Kitchen", 
    "Decor", "Toy", "Tool", "Sport", "Outdoor", "Cosmetic", "Food", "Pet"
  ];

  // Handle selecting a tag
  const handleTagSelect = (tag: string) => {
    const currentTags = row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      onUpdate(row.id, "tags", newTags.join(', '));
    }
  };

  // Validate on blur
  const handleBlur = (field: keyof RowItem) => {
    if (validateRow) {
      validateRow({...row});
    }
  };

  return (
    <tr className={row.hasErrors ? "bg-red-50" : ""}>
      <td>
        <div>
          <Input
            value={row.name}
            onChange={(e) => onUpdate(row.id, "name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Item name"
            className={`h-9 ${row.errors?.name ? "border-destructive" : ""}`}
          />
          {row.errors?.name && (
            <div className="text-destructive text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {row.errors.name}
            </div>
          )}
        </div>
      </td>
      <td>
        <Input
          value={row.description}
          onChange={(e) => onUpdate(row.id, "description", e.target.value)}
          placeholder="Description"
          className="h-9"
        />
      </td>
      <td>
        <div>
          <Input
            type="number"
            min="1"
            value={row.quantity}
            onChange={(e) => onUpdate(row.id, "quantity", parseInt(e.target.value) || 1)}
            onBlur={() => handleBlur("quantity")}
            className={`h-9 ${row.errors?.quantity ? "border-destructive" : ""}`}
          />
          {row.errors?.quantity && (
            <div className="text-destructive text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {row.errors.quantity}
            </div>
          )}
        </div>
      </td>
      <td>
        <Select 
          value={row.location}
          onValueChange={(value) => onUpdate(row.id, "location", value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 w-full flex justify-between items-center text-left font-normal">
                <span className="truncate">{row.tags || "Select tags"}</span>
                <Tag size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 max-h-60 overflow-auto">
              {commonTags.map((tag) => (
                <DropdownMenuItem 
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {row.errors?.tags && (
            <div className="text-destructive text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {row.errors.tags}
            </div>
          )}
        </div>
      </td>
      <td>
        <div>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={row.price !== undefined ? row.price : ""}
            onChange={(e) => onUpdate(row.id, "price", e.target.value ? parseFloat(e.target.value) : undefined)}
            onBlur={() => handleBlur("price")}
            placeholder="Value/Cost"
            className={`h-9 ${row.errors?.price ? "border-destructive" : ""}`}
          />
          {row.errors?.price && (
            <div className="text-destructive text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {row.errors.price}
            </div>
          )}
        </div>
      </td>
      <td>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.id)}
          className="h-8 w-8 text-destructive hover:text-destructive/90"
        >
          <Trash2 size={16} />
        </Button>
      </td>
    </tr>
  );
};

export default BulkImportRow;
