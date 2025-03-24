
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductViewModalProps {
  product: any;
  onClose: () => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const isLowStock = product.stock <= 10;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Product Details</DialogTitle>
        <DialogDescription>View detailed information about this product.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Product Image */}
          <div className="sm:col-span-1">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto rounded-lg object-cover aspect-square"
            />
          </div>

          {/* Product Details */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              {isLowStock && (
                <Badge variant="destructive">Low Stock</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">Barcode</p>
                <p className="text-sm">{product.barcode}</p>
              </div>
              <div>
                <p className="text-sm font-medium">SKU</p>
                <p className="text-sm">SKU-{product.id.padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Unit Cost</p>
                <p className="text-sm">${(product.price * 0.7).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Retail Price</p>
                <p className="text-sm">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Quantity</p>
                <p className="text-sm">{product.stock} units</p>
              </div>
              <div>
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-sm">10 units</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Barcode Section */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Barcode</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <div className="flex justify-center py-2 bg-white">
            {/* Barcode representation (in real app, use a proper barcode library) */}
            <div className="text-center">
              <div className="h-16 bg-[url('https://t3.ftcdn.net/jpg/00/58/33/12/360_F_58331212_HcxnQJjV1a9hfyK0uUOp7xpO6SQC23rS.jpg')] bg-contain bg-no-repeat bg-center w-48"></div>
              <p className="text-xs mt-1">{product.barcode}</p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProductViewModal;
