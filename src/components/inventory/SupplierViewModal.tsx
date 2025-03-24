
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { mockProducts } from "@/models/product";

interface SupplierViewModalProps {
  supplier: any;
  onClose: () => void;
}

const SupplierViewModal: React.FC<SupplierViewModalProps> = ({ supplier, onClose }) => {
  if (!supplier) return null;

  // Get products supplied by this supplier
  const suppliedProducts = mockProducts.filter(product => 
    supplier.products.includes(product.id)
  );

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Supplier Details</DialogTitle>
        <DialogDescription>View detailed information about this supplier.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Supplier Name</p>
            <p className="text-base">{supplier.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Contact Person</p>
            <p className="text-base">{supplier.contactPerson}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-base">{supplier.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-base">{supplier.phone}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium">Address</p>
            <p className="text-base">{supplier.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Tax ID / VAT Number</p>
            <p className="text-base">{supplier.taxId || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Payment Terms</p>
            <p className="text-base">{supplier.paymentTerms || "N/A"}</p>
          </div>
          {supplier.notes && (
            <div className="sm:col-span-2">
              <p className="text-sm font-medium">Notes</p>
              <p className="text-base">{supplier.notes}</p>
            </div>
          )}
        </div>

        {/* Supplied Products */}
        <div>
          <p className="text-sm font-medium mb-2">Products Supplied ({suppliedProducts.length})</p>
          <div className="rounded-md border overflow-hidden max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-left font-medium">Category</th>
                  <th className="h-10 px-4 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {suppliedProducts.map(product => (
                  <tr key={product.id} className="border-t">
                    <td className="p-2 pl-4 font-medium">{product.name}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2 pr-4 text-right">${product.price.toFixed(2)}</td>
                  </tr>
                ))}
                {suppliedProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted-foreground">No products associated with this supplier</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase History */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Purchase History</p>
            <Button variant="outline" size="sm" className="h-8">
              <FileText className="h-3.5 w-3.5 mr-1" />
              View All
            </Button>
          </div>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">PO Number</th>
                  <th className="h-10 px-4 text-left font-medium">Date</th>
                  <th className="h-10 px-4 text-right font-medium">Value</th>
                  <th className="h-10 px-4 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 pl-4 font-medium">PO-2023-001</td>
                  <td className="p-2">2023-11-10</td>
                  <td className="p-2 text-right">$14,299.83</td>
                  <td className="p-2 pr-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 pl-4 font-medium">PO-2022-089</td>
                  <td className="p-2">2022-09-15</td>
                  <td className="p-2 text-right">$8,754.50</td>
                  <td className="p-2 pr-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SupplierViewModal;
