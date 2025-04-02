
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Supplier } from '@/models/interfaces/supplierInterfaces';

export interface SupplierDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  supplier: Supplier;
}

const SupplierDeleteDialog: React.FC<SupplierDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  supplier
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{supplier.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SupplierDeleteDialog;
