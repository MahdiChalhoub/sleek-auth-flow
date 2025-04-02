import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Search, Trash, Edit, Eye } from "lucide-react";
import SupplierFormDialog from "@/components/inventory/SupplierFormDialog";
import SupplierViewModal from "@/components/inventory/SupplierViewModal";
import SupplierDeleteDialog from "@/components/inventory/SupplierDeleteDialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSuppliers(
        suppliers.filter(supplier => 
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (supplier.contact_person && supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (supplier.phone && supplier.phone.includes(searchTerm)) ||
          (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredSuppliers(suppliers);
    }
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setSuppliers(data || []);
      setFilteredSuppliers(data || []);
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (supplierData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();
      
      if (error) throw error;
      
      setSuppliers(prev => [...prev, data]);
      toast.success('Supplier added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding supplier:', error);
      toast.error('Failed to add supplier', {
        description: error.message
      });
      return false;
    }
  };

  const handleUpdateSupplier = async (id: string, supplierData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setSuppliers(prev => prev.map(s => s.id === id ? data : s));
      toast.success('Supplier updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating supplier:', error);
      toast.error('Failed to update supplier', {
        description: error.message
      });
      return false;
    }
  };

  const handleDeleteSupplier = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSuppliers(prev => prev.filter(s => s.id !== id));
      toast.success('Supplier deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier', {
        description: error.message
      });
      return false;
    }
  };

  const handleViewSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowEditDialog(true);
  };

  const handleDeleteConfirm = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowDeleteDialog(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Suppliers</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No suppliers match your search' : 'No suppliers found. Add your first supplier!'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact_person || '-'}</TableCell>
                      <TableCell>{supplier.phone || '-'}</TableCell>
                      <TableCell>{supplier.email || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSupplier(supplier)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSupplier(supplier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteConfirm(supplier)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <SupplierFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(data) => voidPromise(handleAddSupplier(data))}
      />

      {selectedSupplier && (
        <SupplierFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={(data) => voidPromise(handleUpdateSupplier(selectedSupplier.id, data))}
          supplier={selectedSupplier}
        />
      )}

      {selectedSupplier && (
        <SupplierViewModal
          supplier={selectedSupplier}
          onClose={() => setShowViewModal(false)}
          isOpen={showViewModal}
        />
      )}

      {selectedSupplier && (
        <SupplierDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => handleDeleteSupplier(selectedSupplier.id)}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
};

export default Suppliers;
