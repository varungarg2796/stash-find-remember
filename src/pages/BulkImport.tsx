
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Download, Save } from "lucide-react";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RowItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  location: string;
  tags: string;
}

const SAMPLE_LOCATIONS = ["Wardrobe", "Kitchen", "Bookshelf", "Drawer", "Garage", "Basement", "Attic"];

const BulkImport = () => {
  const navigate = useNavigate();
  const { addItem, getActiveItems } = useItems();
  const activeItems = getActiveItems();
  
  // Extract unique locations from existing items
  const existingLocations = [...new Set(activeItems.map(item => item.location))];
  const availableLocations = [...new Set([...SAMPLE_LOCATIONS, ...existingLocations])];
  
  const [rows, setRows] = useState<RowItem[]>([
    { id: "1", name: "", description: "", quantity: 1, location: "", tags: "" }
  ]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  const addRow = () => {
    const newRow: RowItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      location: "",
      tags: ""
    };
    setRows([...rows, newRow]);
  };
  
  const deleteRow = (id: string) => {
    if (rows.length === 1) {
      toast.error("You must have at least one row");
      return;
    }
    setRows(rows.filter(row => row.id !== id));
  };
  
  const updateRow = (id: string, field: keyof RowItem, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };
  
  const handleSaveAll = () => {
    // Validate input
    const invalidRows = rows.filter(row => !row.name.trim());
    if (invalidRows.length > 0) {
      toast.error("All items must have a name");
      return;
    }
    
    // Process and save each row
    rows.forEach(row => {
      const item = {
        name: row.name.trim(),
        description: row.description.trim(),
        quantity: parseInt(row.quantity.toString()) || 1,
        location: row.location.trim(),
        tags: row.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        imageUrl: "/lovable-uploads/earbuds.png" // Default image
      };
      
      addItem(item);
    });
    
    toast.success(`${rows.length} items added successfully`);
    navigate("/");
  };
  
  // Create a template for export
  const generateTemplate = () => {
    const headers = ["Name", "Description", "Quantity", "Location", "Tags (comma-separated)"];
    const csvContent = [
      headers.join(","),
      "Example Item,This is a sample description,1,Kitchen,Kitchen,Electronics"
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stasher_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Plus size={24} className="mr-2 text-gray-600" />
          Bulk Import Items
        </h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowHelpDialog(true)}
            className="text-sm"
          >
            How It Works
          </Button>
          <Button 
            variant="outline" 
            onClick={generateTemplate}
            className="text-sm flex items-center"
          >
            <Download size={16} className="mr-1" />
            Template
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Name*</TableHead>
                <TableHead className="w-[220px]">Description</TableHead>
                <TableHead className="w-[100px]">Quantity</TableHead>
                <TableHead className="w-[150px]">Location</TableHead>
                <TableHead className="w-[200px]">Tags (comma separated)</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                      placeholder="Item name"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.description}
                      onChange={(e) => updateRow(row.id, "description", e.target.value)}
                      placeholder="Description"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, "quantity", parseInt(e.target.value) || 1)}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={row.location}
                      onValueChange={(value) => updateRow(row.id, "location", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.tags}
                      onChange={(e) => updateRow(row.id, "tags", e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(row.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={addRow} variant="outline" className="flex items-center">
          <Plus size={16} className="mr-1" />
          Add Row
        </Button>
        
        <Button onClick={handleSaveAll} className="flex items-center">
          <Save size={16} className="mr-1" />
          Save All Items
        </Button>
      </div>
      
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use Bulk Import</DialogTitle>
            <DialogDescription className="pt-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fill in the spreadsheet-like table with your item details</li>
                <li>Each row represents one item in your inventory</li>
                <li>Only the Name field is required</li>
                <li>For Tags, enter comma-separated values (e.g., "Kitchen, Electronics")</li>
                <li>Click "Add Row" to add more items</li>
                <li>Click "Save All Items" when you're ready to add everything to your inventory</li>
              </ol>
              
              <p className="mt-4 italic text-muted-foreground">
                Need a template? Click the "Template" button to download a sample CSV template.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkImport;
