
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Phone,
  User,
  Clipboard,
  Tag,
  ShoppingBag
} from "lucide-react";
import { mockProducts } from "@/models/mockData";

export interface SupplierViewModalProps {
  supplier: any;
  onClose: () => void;
  isOpen: boolean;
}

const SupplierViewModal: React.FC<SupplierViewModalProps> = ({
  supplier,
  onClose,
  isOpen
}) => {
  if (!supplier) return null;

  // Find products associated with this supplier
  const supplierProducts = supplier.products 
    ? mockProducts.filter(product => supplier.products.includes(product.id)) 
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{supplier.name}</DialogTitle>
          <DialogDescription>
            Supplier Information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supplier.contact_person && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.contact_person}</span>
                </div>
              )}
              
              {supplier.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.phone}</span>
                </div>
              )}
              
              {supplier.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.email}</span>
                </div>
              )}
              
              {supplier.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplier.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {supplier.notes && (
            <div className="bg-muted/40 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-medium">Notes</h3>
              <div className="flex items-start space-x-2">
                <Clipboard className="h-4 w-4 text-muted-foreground mt-1" />
                <p className="text-sm whitespace-pre-line">{supplier.notes}</p>
              </div>
            </div>
          )}

          {/* Products */}
          {supplierProducts.length > 0 && (
            <div className="bg-muted/40 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-medium">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {supplierProducts.map(product => (
                  <div key={product.id} className="flex flex-col p-3 bg-white rounded-md shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      {product.hasStock ? (
                        <Badge variant={product.stock > 10 ? "default" : "secondary"} className="ml-2">
                          {product.stock} in stock
                        </Badge>
                      ) : (
                        <Badge variant="outline">No Stock</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-auto">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      <span className="truncate">Cost: ${product.cost?.toFixed(2) || 'N/A'}</span>
                    </div>
                    {product.category && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>{product.category.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierViewModal;
