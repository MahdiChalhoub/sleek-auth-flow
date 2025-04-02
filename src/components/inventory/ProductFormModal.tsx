
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/models/product';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Branch } from '@/types/location';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave?: (product: Product) => void;
  currentLocation?: Branch;
}

// Define the form schema with Zod
const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long' }),
  description: z.string().optional(),
  barcode: z.string().optional(),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  cost: z.coerce.number().positive({ message: 'Cost must be a positive number' }).optional(),
  stock: z.coerce.number().int().optional(),
  categoryId: z.string().optional(),
  hasStock: z.boolean().default(true),
  isCombo: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductFormModal = ({ isOpen, onClose, product, onSave, currentLocation }: ProductFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!product;

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors }, 
    setValue, 
    watch 
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      barcode: product?.barcode || '',
      price: product?.price || 0,
      cost: product?.cost || 0,
      stock: product?.stock || 0,
      categoryId: product?.category?.id || '',
      hasStock: product?.hasStock ?? true,
      isCombo: product?.isCombo ?? false,
    }
  });

  const hasStock = watch('hasStock');
  const isCombo = watch('isCombo');

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would save to the backend
      console.log('Saving product data:', data);
      if (onSave) {
        const savedProduct = {
          id: product?.id || `new-${Date.now()}`,
          name: data.name,
          description: data.description || '',
          barcode: data.barcode || '',
          price: data.price,
          cost: data.cost || 0,
          stock: hasStock ? (data.stock || 0) : 0,
          hasStock: data.hasStock,
          isCombo: data.isCombo,
          category: data.categoryId ? { id: data.categoryId, name: '' } : undefined,
        } as Product;
        
        onSave(savedProduct);
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode / SKU</Label>
              <Input id="barcode" {...register('barcode')} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" step="0.01" {...register('cost')} />
              {errors.cost && <p className="text-sm text-red-500">{errors.cost.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select 
                value={watch('categoryId') || ''} 
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Uncategorized</SelectItem>
                  {/* Categories would be loaded from API */}
                  <SelectItem value="cat1">Beverages</SelectItem>
                  <SelectItem value="cat2">Food</SelectItem>
                  <SelectItem value="cat3">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {hasStock && (
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" {...register('stock')} />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="hasStock" 
                checked={hasStock}
                onCheckedChange={(checked) => setValue('hasStock', checked)}
              />
              <Label htmlFor="hasStock">Track Inventory</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isCombo" 
                checked={isCombo}
                onCheckedChange={(checked) => setValue('isCombo', checked)}
              />
              <Label htmlFor="isCombo">This is a combo/bundle product</Label>
            </div>
          </div>
          
          {currentLocation && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">Adding product to: <strong>{currentLocation.name}</strong></p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
