
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Supplier } from '@/models/interfaces/supplierInterfaces';

interface SupplierDeleteDialogProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

const SupplierDeleteDialog: React.FC<SupplierDeleteDialogProps> = ({
  supplier,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!supplier) return;
    
    setIsDeleting(true);
    try {
      await onDelete(supplier.id);
      onClose();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!supplier) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the supplier <strong>{supplier.name}</strong> and cannot be
            undone. This may also affect related purchase orders and inventory records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Supplier'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SupplierDeleteDialog;
