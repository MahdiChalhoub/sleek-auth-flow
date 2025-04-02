
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SupplierDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: { id: string; name: string };
  onConfirm: () => Promise<boolean>;
}

export function SupplierDeleteDialog({
  open,
  onOpenChange,
  supplier,
  onConfirm,
}: SupplierDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Supplier
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {supplier.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 text-amber-700 p-3 rounded-md text-sm">
          Deleting a supplier will remove their information from the system but will preserve references in historical records.
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
