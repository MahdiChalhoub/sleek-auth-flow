
import React, { useState } from "react";
import { Product } from "@/models/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash, Percent } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
    discount: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onUpdateDiscount: (productId: string, discount: number) => void;
}

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  onUpdateDiscount 
}: CartItemProps) => {
  const { product, quantity, discount } = item;
  
  // Calculate item total price with discount
  const calculateItemTotal = () => {
    const subtotal = product.price * quantity;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };
  
  return (
    <Card className="overflow-hidden glass-card animate-fade-in">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Product Image */}
          <div 
            className="h-16 w-16 rounded-md bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${product.image})` }}
          ></div>
          
          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{product.barcode}</p>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      ${product.price.toFixed(2)}
                    </p>
                    {discount > 0 && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                        {discount}% off
                      </span>
                    )}
                  </div>
                  
                  <p className="font-medium">
                    ${calculateItemTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions Row */}
            <div className="flex items-center justify-between mt-2">
              {/* Quantity Controls */}
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Discount Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Percent className="h-3.5 w-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Apply Discount</p>
                      <div className="flex items-center">
                        <Input 
                          type="number"
                          value={discount}
                          min={0}
                          max={100}
                          className="h-8"
                          onChange={(e) => onUpdateDiscount(product.id, Number(e.target.value))}
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
                  className="h-7 w-7 text-muted-foreground hover:text-red-500"
                  onClick={() => onRemove(product.id)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
