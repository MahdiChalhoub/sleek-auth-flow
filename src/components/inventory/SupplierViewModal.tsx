
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Supplier } from '@/models/interfaces/supplierInterfaces';

export interface SupplierViewModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

const SupplierViewModal: React.FC<SupplierViewModalProps> = ({
  supplier,
  isOpen,
  onClose
}) => {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Supplier Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-4">General Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-base">{supplier.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="mt-1 text-base">{supplier.contact_person || 'Not specified'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-base">
                  {supplier.email ? (
                    <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                      {supplier.email}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-base">
                  {supplier.phone ? (
                    <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:underline">
                      {supplier.phone}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-base">{supplier.address || 'Not specified'}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Products & Notes</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Products Supplied</h4>
              <div className="flex flex-wrap gap-2">
                {supplier.products && supplier.products.length > 0 ? (
                  supplier.products.map((productId) => (
                    <Badge key={productId} variant="outline" className="text-xs">
                      {productId}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs">
                    No products linked
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
              <div className="p-3 rounded-md bg-slate-50 min-h-[100px]">
                {supplier.notes || 'No notes available'}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierViewModal;
