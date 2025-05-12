
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RowItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  location: string;
  tags: string;
  hasErrors?: boolean;
  errors?: {
    name?: string;
    quantity?: string;
    tags?: string;
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
  // Validate on blur
  const handleBlur = (field: keyof RowItem) => {
    if (validateRow) {
      const validatedRow = validateRow({...row});
      if (validatedRow.errors && validatedRow.errors[field]) {
        // Just trigger validation, the parent component will handle updating the row
      }
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
          <Input
            value={row.tags}
            onChange={(e) => onUpdate(row.id, "tags", e.target.value)}
            onBlur={() => handleBlur("tags")}
            placeholder="tag1, tag2, tag3"
            className={`h-9 ${row.errors?.tags ? "border-destructive" : ""}`}
          />
          {row.errors?.tags && (
            <div className="text-destructive text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {row.errors.tags}
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
