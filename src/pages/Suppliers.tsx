import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Search, Trash, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { SupplierFormDialog, SupplierFormData } from '@/components/suppliers/SupplierFormDialog';
import { formatDate } from '@/utils/formatters';
import { supabase } from '@/lib/supabase';

interface Supplier {
  id: string;
  name: string;
  address?: string;
  email?: string;
  notes?: string;
  phone?: string;
  contact_person?: string;
  created_at?: string;
  updated_at?: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setSuppliers(data || []);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        toast.error('Failed to load suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    let filtered = [...suppliers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier =>
        (supplier.name && supplier.name.toLowerCase().includes(term)) ||
        (supplier.email && supplier.email.toLowerCase().includes(term)) ||
        (supplier.phone && supplier.phone.toLowerCase().includes(term))
      );
    }

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm]);

  const addSupplier = async (supplierData: SupplierFormData) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setSuppliers(prev => [data, ...prev]);
      toast.success('Supplier added successfully');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Failed to add supplier');
    }
  };

  const updateSupplier = async (supplierData: SupplierFormData) => {
    if (!selectedSupplier) return;
    
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', selectedSupplier.id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setSuppliers(prev =>
        prev.map(supplier => (supplier.id === selectedSupplier.id ? data : supplier))
      );
      toast.success('Supplier updated successfully');
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Failed to update supplier');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your suppliers</p>
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Suppliers List</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No suppliers match your search criteria' : 'No suppliers found'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.contact_person}</TableCell>
                      <TableCell>{formatDate(supplier.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedSupplier(supplier);
                              setShowEditDialog(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Supplier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteSupplier(supplier.id)} className="text-destructive focus:text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Supplier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
        onSubmit={addSupplier}
      />

      {selectedSupplier && (
        <SupplierFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={updateSupplier}
          supplier={selectedSupplier}
          title="Edit Supplier"
        />
      )}
    </div>
  );
};

export default Suppliers;
