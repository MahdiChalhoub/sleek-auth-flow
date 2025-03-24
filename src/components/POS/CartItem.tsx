
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, Percent } from "lucide-react";
import { Product } from "@/models/product";

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
    discount: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onUpdateDiscount: (productId: string, discount: number) => void;
  requireSecurityCheck: (actionType: 'delete' | 'discount', callback: () => void) => void;
}

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onUpdateDiscount,
  requireSecurityCheck
}: CartItemProps) => {
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState(item.discount);
  
  // Calculate totals
  const itemSubtotal = item.product.price * item.quantity;
  const discountAmount = itemSubtotal * (item.discount / 100);
  const itemTotal = itemSubtotal - discountAmount;
  
  // Handle quantity changes
  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    onUpdateQuantity(item.product.id, item.quantity + 1);
  };
  
  // Handle discount changes
  const toggleDiscountField = () => {
    setIsDiscountOpen(!isDiscountOpen);
    setDiscountValue(item.discount);
  };
  
  const applyDiscount = () => {
    requireSecurityCheck('discount', () => {
      onUpdateDiscount(item.product.id, discountValue);
      setIsDiscountOpen(false);
    });
  };
  
  // Handle item removal
  const handleRemove = () => {
    requireSecurityCheck('delete', () => {
      onRemove(item.product.id);
    });
  };
  
  return (
    <div className="border-b p-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={item.product.image} 
            alt={item.product.name} 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{item.product.name}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>${item.product.price.toFixed(2)}</span>
            {item.discount > 0 && (
              <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
                -{item.discount}%
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7" 
            onClick={decrementQuantity}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
            className="w-12 h-7 text-center p-0"
            min={1}
          />
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7" 
            onClick={incrementQuantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="w-20 text-right">
          <p className="font-medium">${itemTotal.toFixed(2)}</p>
          {item.discount > 0 && (
            <p className="text-xs text-muted-foreground line-through">
              ${itemSubtotal.toFixed(2)}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={toggleDiscountField}
          >
            <Percent className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Discount field */}
      {isDiscountOpen && (
        <div className="mt-2 flex items-center gap-2 pl-12 animate-fade-in">
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-20 h-7"
              min={0}
              max={100}
            />
            <span className="text-sm">%</span>
          </div>
          <Button
            size="sm"
            className="h-7"
            onClick={applyDiscount}
          >
            Apply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={() => setIsDiscountOpen(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartItem;
