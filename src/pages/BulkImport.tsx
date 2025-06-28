import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Save, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BulkImportRow, { RowItem } from '@/components/form/BulkImportRow';
import { useBulkCreateItemsMutation } from '@/hooks/useItemsQuery';
import { Item } from '@/types';

const MAX_BULK_IMPORT_ITEMS = 40;

const BulkImport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bulkCreateMutation = useBulkCreateItemsMutation();

  // The locations for the dropdown now come directly from the user object
  const availableLocations = user?.locations.map(loc => loc.name) || [];

  const [rows, setRows] = useState<RowItem[]>([
    { id: '1', name: '', description: '', quantity: 1, location: '', tags: '', price: undefined }
  ]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const addRow = () => {
    if (rows.length >= MAX_BULK_IMPORT_ITEMS) {
      toast.error(`Maximum ${MAX_BULK_IMPORT_ITEMS} items allowed.`);
      return;
    }
    const newRow: RowItem = { id: Date.now().toString(), name: '', description: '', quantity: 1, location: '', tags: '', price: undefined };
    setRows([...rows, newRow]);
  };
  
  const deleteRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    } else {
      toast.error('You must have at least one row.');
    }
  };
  
  const updateRow = (
    id: string,
    field: keyof RowItem,
    value: string | number | undefined
  ) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };
  
  const handleSaveAll = () => {
    // Basic client-side check for empty names
    if (rows.some(row => !row.name.trim())) {
      toast.error('All rows must have an item name.');
      return;
    }
    
    // Convert frontend row state to the DTO format expected by the backend
    const itemsToCreate: Partial<Omit<Item, 'id'>>[] = rows.map(row => ({
      name: row.name.trim(),
      description: row.description.trim(),
      quantity: Number(row.quantity) || 1,
      location: row.location?.trim() || undefined,
      tags: row.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      price: row.price,
      // The backend will handle validation for non-existent tags/locations
    }));

    bulkCreateMutation.mutate(itemsToCreate, {
      onSuccess: () => {
        navigate('/my-stash');
      },
    });
  };
  
  const isSaving = bulkCreateMutation.isPending;
  const isAtLimit = rows.length >= MAX_BULK_IMPORT_ITEMS;

  if (!user) return null; // Render nothing if user is not available

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4" disabled={isSaving}>
        <ArrowLeft className="mr-2" size={18} /> Back
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bulk Import Items</h1>
        <Button variant="outline" onClick={() => setShowHelpDialog(true)}>How It Works</Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Items: {rows.length} / {MAX_BULK_IMPORT_ITEMS}</p>
        {isAtLimit && (
          <div className="flex items-center text-sm text-red-600">
            <AlertTriangle size={16} className="mr-1" /> Maximum items reached
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-[180px]">Name*</TableHead>
              <TableHead className="w-[180px]">Description</TableHead>
              <TableHead className="w-[100px]">Quantity</TableHead>
              <TableHead className="w-[150px]">Location</TableHead>
              <TableHead className="w-[180px]">Tags (comma-separated)</TableHead>
              <TableHead className="w-[120px]">Value/Cost</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((row) => (
                <BulkImportRow
                  key={row.id}
                  row={row}
                  locations={availableLocations}
                  onUpdate={updateRow}
                  onDelete={deleteRow}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button onClick={addRow} variant="outline" disabled={isAtLimit || isSaving}>
          <Plus size={16} className="mr-1" /> Add Row
        </Button>
        <Button onClick={handleSaveAll} disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="mr-1 animate-spin" /> : <Save size={16} className="mr-1" />}
          {isSaving ? "Saving..." : "Save All Items"}
        </Button>
      </div>
      
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use Bulk Import</DialogTitle>
            <DialogDescription className="pt-4">
              Fill in the table with your item details. Only the Name is required. For tags, provide a comma-separated list. All locations and tags must already exist in your profile settings. Click "Save All Items" to import everything at once.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkImport;