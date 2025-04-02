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

// Update to ensure name is required in SupplierFormData
interface SupplierFormData {
  name: string; // Making name required
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  notes?: string;
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsCreating(true);
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
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error('Failed to create supplier');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSupplierToDelete(id);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierToDelete);

      if (error) throw error;

      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierToDelete));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier');
    } finally {
      setIsDeleting(false);
      setSupplierToDelete(null);
    }
  };

  const cancelDelete = () => {
    setSupplierToDelete(null);
    setIsDeleting(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Supplier</DialogTitle>
              <DialogDescription>
                Create a new supplier to manage your supply chain.
              </DialogDescription>
            </DialogHeader>
            <SupplierForm onCreate={handleCreate} isLoading={isCreating} onClose={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want to delete <span className="font-semibold">{supplier.name}</span>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                          <AlertDialogAction disabled={isDeleting} onClick={() => confirmDelete()}>
                            {isDeleting ? <Spinner size="sm" className="mr-2" /> : null}
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  Total Suppliers: {suppliers.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

interface SupplierFormProps {
  onCreate: (data: SupplierFormData) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onCreate, isLoading, onClose }) => {
  const [data, setData] = useState<SupplierFormData>({ name: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name) {
      toast.error('Name is required');
      return;
    }
    await onCreate(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={data.address}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={data.phone}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input
          type="text"
          id="contact_person"
          name="contact_person"
          value={data.contact_person}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          name="notes"
          value={data.notes}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
        Create
      </Button>
    </form>
  );
};

export default Suppliers;
