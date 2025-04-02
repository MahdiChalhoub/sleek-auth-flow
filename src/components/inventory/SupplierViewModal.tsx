
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Supplier } from '@/models/interfaces/supplierInterfaces';

export interface SupplierViewModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

const SupplierViewModal: React.FC<SupplierViewModalProps> = ({ supplier, isOpen, onClose }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{supplier.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border-b pb-2">
              <div className="text-sm font-medium">Contact Person</div>
              <div>{supplier.contact_person || 'Not specified'}</div>
            </div>
            
            <div className="border-b pb-2">
              <div className="text-sm font-medium">Email</div>
              <div>{supplier.email || 'Not specified'}</div>
            </div>
            
            <div className="border-b pb-2">
              <div className="text-sm font-medium">Phone</div>
              <div>{supplier.phone || 'Not specified'}</div>
            </div>
            
            <div className="border-b pb-2">
              <div className="text-sm font-medium">Address</div>
              <div>{supplier.address || 'Not specified'}</div>
            </div>
            
            <div className="border-b pb-2">
              <div className="text-sm font-medium">Notes</div>
              <div>{supplier.notes || 'No notes'}</div>
            </div>
            
            <div className="border-b pb-2">
              <div className="text-sm font-medium">Added</div>
              <div>{formatDate(supplier.created_at)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium">Last Updated</div>
              <div>{formatDate(supplier.updated_at)}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierViewModal;
