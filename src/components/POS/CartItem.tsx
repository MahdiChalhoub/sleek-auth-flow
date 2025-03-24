
import React from "react";
import { Product } from "@/models/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus, Trash, Percent, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
    discount: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onUpdateDiscount: (productId: string, discount: number) => void;
  requireSecurityCheck: (action: 'delete' | 'discount', callback: () => void) => void;
}

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  onUpdateDiscount,
  requireSecurityCheck
}: CartItemProps) => {
  const { toast } = useToast();
  const { product, quantity, discount } = item;
  
  // Calculate item total price with discount
  const calculateItemTotal = () => {
    const subtotal = product.price * quantity;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  const handleRemove = () => {
    requireSecurityCheck('delete', () => onRemove(product.id));
  };

  const handleDiscount = (value: number) => {
    requireSecurityCheck('discount', () => onUpdateDiscount(product.id, value));
  };
  
  return (
    <div className="py-2 border-b border-border flex items-center gap-1 animate-fade-in">
      {/* Product Image */}
      <div 
        className="h-10 w-10 rounded-md bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${product.image})` }}
      ></div>
      
      {/* Product Name */}
      <div className="flex-grow min-w-0 px-2">
        <p className="font-medium text-sm truncate">{product.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
          {discount > 0 && (
            <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1 py-0.5 rounded-full">
              {discount}%
            </span>
          )}
        </div>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center font-medium text-sm">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Item Total */}
      <div className="w-20 text-right font-medium">
        ${calculateItemTotal().toFixed(2)}
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-1 ml-1">
        {/* Discount Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Percent className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Apply Discount</p>
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-center">
                <Input 
                  type="number"
                  value={discount}
                  min={0}
                  max={100}
                  className="h-8"
                  onChange={(e) => handleDiscount(Number(e.target.value))}
                />
                <span className="ml-2">%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Original: ${(product.price * quantity).toFixed(2)}</span>
                <span>With discount: ${calculateItemTotal().toFixed(2)}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-red-500"
          onClick={handleRemove}
        >
          <Trash className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
