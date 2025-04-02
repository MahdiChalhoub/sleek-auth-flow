
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from '@/components/ui/spinner';
import SupplierFormDialog from '@/components/suppliers/SupplierFormDialog';
import { Supplier, SupplierFormData } from '@/models/interfaces/supplierInterfaces';
import SupplierViewModal from '@/components/inventory/SupplierViewModal';
import SupplierDeleteDialog from '@/components/inventory/SupplierDeleteDialog';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: SupplierFormData) => {
    try {
      const { data: supplier, error } = await supabase
        .from('suppliers')
        .insert({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          contact_person: data.contact_person,
          notes: data.notes
        })
        .select()
        .single();

      if (error) throw error;
    
      setSuppliers(prev => [...prev, supplier]);
      toast.success('Supplier created successfully');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error('Failed to create supplier');
    }
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSupplier) return false;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', selectedSupplier.id);

      if (error) throw error;

      setSuppliers(prev => prev.filter(supplier => supplier.id !== selectedSupplier.id));
      toast.success('Supplier deleted successfully');
      setIsDeleteDialogOpen(false);
      return true;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier');
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <ScrollArea>
          <Table>
            <TableCaption>A list of your suppliers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.contact_person}</TableCell>
                  <TableCell>{supplier.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewSupplier(supplier)}>
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSupplier(supplier)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  Total Suppliers: {suppliers.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>
      )}

      {/* Add supplier dialog */}
      <SupplierFormDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreate}
      />

      {/* View supplier modal */}
      {selectedSupplier && (
        <SupplierViewModal
          supplier={selectedSupplier}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {/* Delete supplier dialog */}
      {selectedSupplier && (
        <SupplierDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
};

export default Suppliers;
