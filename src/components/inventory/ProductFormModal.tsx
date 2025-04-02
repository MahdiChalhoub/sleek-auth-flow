import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types/location';

export interface ProductFormModalProps {
  product?: any;
  onClose: () => void;
  currentLocation?: Branch;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, currentLocation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const isEditMode = !!product;

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      cost: product?.cost || '',
      barcode: product?.barcode || '',
      stock: product?.stock || 0,
      categoryId: product?.categoryId || '',
      hasStock: product?.hasStock !== false,
      minStockLevel: product?.minStockLevel || 0,
      maxStockLevel: product?.maxStockLevel || 0,
      isCombo: product?.isCombo || false,
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        cost: data.cost ? parseFloat(data.cost) : null,
        barcode: data.barcode,
        stock: data.hasStock ? parseInt(data.stock) : 0,
        category_id: data.categoryId || null,
        has_stock: data.hasStock,
        min_stock_level: data.minStockLevel ? parseInt(data.minStockLevel) : 0,
        max_stock_level: data.maxStockLevel ? parseInt(data.maxStockLevel) : 0,
        is_combo: data.isCombo,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        toast.success('Product added successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the product details below.' 
              : 'Fill in the product details to add it to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  {...register('name', { required: 'Product name is required' })} 
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  {...register('description')} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    {...register('price', { required: 'Price is required' })} 
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message as string}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (Optional)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    step="0.01" 
                    {...register('cost')} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode (Optional)</Label>
                <Input 
                  id="barcode" 
                  {...register('barcode')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="hasStock"
                  control={control}
                  render={({ field }) => (
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="hasStock" 
                    />
                  )}
                />
                <Label htmlFor="hasStock">Track Inventory</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  {...register('stock', { 
                    valueAsNumber: true,
                    validate: (value, formValues) => 
                      !formValues.hasStock || value >= 0 || 'Stock cannot be negative'
                  })} 
                  disabled={!product?.hasStock}
                />
                {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message as string}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minStockLevel">Min Stock Level</Label>
                  <Input 
                    id="minStockLevel" 
                    type="number" 
                    {...register('minStockLevel', { valueAsNumber: true })} 
                    disabled={!product?.hasStock}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                  <Input 
                    id="maxStockLevel" 
                    type="number" 
                    {...register('maxStockLevel', { valueAsNumber: true })} 
                    disabled={!product?.hasStock}
                  />
                </div>
              </div>
              
              {currentLocation && (
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Location: {currentLocation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Stock will be added to this location.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="isCombo"
                  control={control}
                  render={({ field }) => (
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="isCombo" 
                    />
                  )}
                />
                <Label htmlFor="isCombo">This is a combo product</Label>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Combo Products</h3>
                <p className="text-sm text-muted-foreground">
                  Combo products are made up of other products in your inventory.
                  You can add components after creating the product.
                </p>
              </div>
              
              {/* Additional advanced settings can go here */}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
