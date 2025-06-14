import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
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
import BulkImportRow, { RowItem } from "@/components/form/BulkImportRow";
import { validateItemName, validateQuantity, validatePrice } from "@/utils/validationUtils";

const SAMPLE_LOCATIONS = ["Wardrobe", "Kitchen", "Bookshelf", "Drawer", "Garage", "Basement", "Attic"];

const BulkImport = () => {
  const navigate = useNavigate();
  const { addItem, getActiveItems } = useItems();
  const activeItems = getActiveItems();
  
  // Extract unique locations from existing items, filtering out empty strings
  const existingLocations = [...new Set(activeItems.map(item => item.location).filter(location => location && location.trim() !== ""))];
  const availableLocations = [...new Set([...SAMPLE_LOCATIONS, ...existingLocations])];
  
  const [rows, setRows] = useState<RowItem[]>([
    { id: "1", name: "", description: "", quantity: 1, location: "", tags: "", price: undefined }
  ]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const addRow = () => {
    const newRow: RowItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      location: "",
      tags: "",
      price: undefined
    };
    setRows([...rows, newRow]);
  };
  
  const deleteRow = (id: string) => {
    if (rows.length === 1) {
      toast.error("You must have at least one row");
      return;
    }
    setRows(rows.filter(row => row.id !== id));
    validateAllRows(rows.filter(row => row.id !== id));
  };
  
  const updateRow = (id: string, field: keyof RowItem, value: any) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    
    setRows(updatedRows);
    // Validate if field is one we care about
    if (["name", "quantity", "tags", "price"].includes(field)) {
      const rowToValidate = updatedRows.find(row => row.id === id);
      if (rowToValidate) {
        validateRow(rowToValidate, updatedRows);
      }
    }
  };
  
  const validateRow = (row: RowItem, allRows = rows): RowItem => {
    const errors: any = {};
    let hasErrors = false;
    
    // Validate name
    const nameValidation = validateItemName(row.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
      hasErrors = true;
    }
    
    // Validate quantity
    const quantityValidation = validateQuantity(row.quantity);
    if (!quantityValidation.isValid) {
      errors.quantity = quantityValidation.message;
      hasErrors = true;
    }
    
    // Validate price if provided
    if (row.price !== undefined) {
      const priceValidation = validatePrice(row.price);
      if (!priceValidation.isValid) {
        errors.price = priceValidation.message;
        hasErrors = true;
      }
    }
    
    // Validate tags
    const tagString = row.tags;
    if (tagString) {
      const tagArray = tagString.split(",");
      if (tagArray.length > 10) {
        errors.tags = "Maximum 10 tags allowed";
        hasErrors = true;
      } else if (tagArray.some(tag => tag.trim().length > 30)) {
        errors.tags = "Each tag must be less than 30 characters";
        hasErrors = true;
      }
    }
    
    // Update the rows state with validation results
    const updatedRows = allRows.map(r => {
      if (r.id === row.id) {
        return { ...r, hasErrors, errors };
      }
      return r;
    });
    setRows(updatedRows);
    
    // Update the overall validation state
    const anyErrors = updatedRows.some(r => r.hasErrors);
    setHasValidationErrors(anyErrors);
    
    return { ...row, hasErrors, errors };
  };
  
  const validateAllRows = useCallback((rowsToValidate = rows) => {
    let anyErrors = false;
    
    const validatedRows = rowsToValidate.map(row => {
      const validated = validateRow(row, rowsToValidate);
      if (validated.hasErrors) anyErrors = true;
      return validated;
    });
    
    setRows(validatedRows);
    setHasValidationErrors(anyErrors);
    return !anyErrors;
  }, [rows]);
  
  const handleSaveAll = async () => {
    // Validate all rows first
    if (!validateAllRows()) {
      toast.error("Please fix validation errors before saving");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Process and save each row
      const promises = rows.map(row => {
        const item = {
          name: row.name.trim(),
          description: row.description.trim(),
          quantity: parseInt(row.quantity.toString()) || 1,
          location: row.location.trim(),
          tags: row.tags.split(",").map(tag => tag.trim()).filter(Boolean),
          price: row.price,
          imageUrl: "/lovable-uploads/earbuds.png" // Default image
        };
        
        return new Promise<void>((resolve) => {
          // Simulate API delay and add item
          setTimeout(() => {
            addItem(item);
            resolve();
          }, 100);
        });
      });
      
      await Promise.all(promises);
      
      toast.success(`${rows.length} items added successfully`);
      navigate("/");
    } catch (error) {
      toast.error("Failed to save items. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
        
        <Button 
          variant="outline" 
          onClick={() => setShowHelpDialog(true)}
          className="text-sm"
        >
          How It Works
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Name*</TableHead>
                <TableHead className="w-[180px]">Description</TableHead>
                <TableHead className="w-[100px]">Quantity</TableHead>
                <TableHead className="w-[150px]">Location</TableHead>
                <TableHead className="w-[180px]">Tags</TableHead>
                <TableHead className="w-[120px]">Value/Cost</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <BulkImportRow
                  key={row.id}
                  row={row}
                  locations={availableLocations}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                  validateRow={(row) => validateRow(row)}
                />
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
        
        <Button 
          onClick={handleSaveAll} 
          className="flex items-center"
          disabled={hasValidationErrors || rows.length === 0 || isSaving}
        >
          {isSaving ? (
            <Loader2 size={16} className="mr-1 animate-spin" />
          ) : (
            <Save size={16} className="mr-1" />
          )}
          {isSaving ? "Saving..." : "Save All Items"}
        </Button>
      </div>
      
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use Bulk Import</DialogTitle>
            <DialogDescription className="pt-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fill in the table with your item details using the form fields</li>
                <li>Each row represents one item in your inventory</li>
                <li>Only the Name field is required - all others are optional</li>
                <li>For Tags, click the dropdown to select from available options</li>
                <li>For Location, choose from the dropdown of existing locations</li>
                <li>Value/Cost is optional - enter a price if you want to track item values</li>
                <li>Click "Add Row" to add more items to your list</li>
                <li>Click "Save All Items" when ready - the system will process all items at once</li>
              </ol>
              
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Tip:</strong> You can add multiple items quickly by filling out several rows before saving. The system will validate all entries and add them to your inventory simultaneously.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkImport;
