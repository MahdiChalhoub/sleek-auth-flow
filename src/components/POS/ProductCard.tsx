
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/models/product";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Use the most appropriate image property
  const imageSource = product.image_url || product.image || "";
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md glass-card animate-fade-in">
      <div 
        className="h-28 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${imageSource})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
          <div className="text-white">
            <p className="font-medium text-xs truncate">{product.name}</p>
            <p className="text-white/80 text-xs truncate">{product.barcode}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  className="h-7 w-7 rounded-full"
                  onClick={onAddToCart}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
