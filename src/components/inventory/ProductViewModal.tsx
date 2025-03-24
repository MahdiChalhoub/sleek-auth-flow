import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Branch } from "@/models/interfaces/businessInterfaces";

interface ProductViewModalProps {
  product: any; 
  onClose?: () => void;
  currentLocation?: Branch | null;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({ product, onClose, currentLocation }) => {
  if (!product) return null;
  
  // Add logic to display location-specific information using currentLocation prop
  // For now, we're just accepting the prop to fix the TypeScript error
  
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Product Details</DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-muted-foreground mt-1">{product.description}</p>
        
        {/* Location-specific information */}
        {currentLocation && (
          <div className="mt-2 text-sm">
            <span className="font-semibold">Location: </span>
            {currentLocation.name}
          </div>
        )}
        
        {/* Rest of the component */}
      </div>
      
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ProductViewModal;
