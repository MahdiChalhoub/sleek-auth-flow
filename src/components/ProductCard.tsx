
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/models/product';
import { formatCurrency } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" onClick={handleClick}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-md truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {product.image_url ? (
          <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-all"
            />
          </div>
        ) : (
          <div className="aspect-square w-full bg-gray-100 flex items-center justify-center rounded-md mb-2">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
        {product.barcode && (
          <p className="text-xs text-muted-foreground">Code: {product.barcode}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Stock: {product.hasStock ? product.stock : 'N/A'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <p className="font-bold">{formatCurrency(product.price)}</p>
        <Button variant="outline" size="sm" onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}>
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
