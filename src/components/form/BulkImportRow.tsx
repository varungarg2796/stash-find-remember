import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

// The RowItem type is now much simpler, as it doesn't need to track errors.
export interface RowItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  location: string;
  tags: string; // Keep as a comma-separated string for the input field
  price?: number;
}

interface BulkImportRowProps {
  row: RowItem;
  locations: string[]; // Pass down the available location names
  onUpdate: (id: string, field: keyof RowItem, value: RowItem[keyof RowItem]) => void;
  onDelete: (id: string) => void;
}

const BulkImportRow = ({ row, locations, onUpdate, onDelete }: BulkImportRowProps) => {
  const { user } = useAuth();

  // The list of all available tags now comes directly from the user object.
  const allUserTags = user?.tags.map(t => t.name) || [];

  return (
    // No more dynamic error classes, as validation is on the backend.
    <tr>
      <td>
        <Input
          value={row.name}
          onChange={(e) => onUpdate(row.id, 'name', e.target.value)}
          placeholder="Item name (required)"
          className="h-9"
        />
      </td>
      <td>
        <Input
          value={row.description}
          onChange={(e) => onUpdate(row.id, 'description', e.target.value)}
          placeholder="Description"
          className="h-9"
        />
      </td>
      <td>
        <Input
          type="number"
          min="1"
          value={row.quantity}
          onChange={(e) => onUpdate(row.id, 'quantity', parseInt(e.target.value, 10) || 1)}
          className="h-9"
        />
      </td>
      <td>
        <Select
          value={row.location}
          onValueChange={(value) => onUpdate(row.id, 'location', value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {/* The locations prop is now just an array of strings */}
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td>
        {/* The UI for tags can now be a simple text input, as per your design */}
        <Input
          value={row.tags}
          onChange={(e) => onUpdate(row.id, 'tags', e.target.value)}
          placeholder="e.g., Electronics, Work"
          className="h-9"
        />
        {/* The Dropdown for picking tags can be added back as a UX improvement,
            but a simple text input is sufficient for the backend logic. */}
      </td>
      <td>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={row.price !== undefined ? row.price : ''}
          onChange={(e) => onUpdate(row.id, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="Value/Cost"
          className="h-9"
        />
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