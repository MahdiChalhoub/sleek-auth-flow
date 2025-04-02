
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/models/interfaces/productInterfaces';
import { ProductFormData } from '@/models/interfaces/productInterfaces';
import { Category } from '@/models/interfaces/categoryInterfaces';
import { categoriesService } from '@/services/categoryService';
import { Branch } from '@/types/location';
import { toast } from 'sonner';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  currentLocation: Branch | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  currentLocation
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    barcode: '',
    price: 0,
    cost: 0,
    stock: 0,
    categoryId: '',
    hasStock: true,
    isCombo: false
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    loadCategories();
  }, []);
  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        barcode: product.barcode || '',
        price: product.price,
        cost: product.cost || 0,
        stock: product.stock,
        categoryId: product.category_id || '',
        hasStock: product.hasStock,
        isCombo: product.is_combo
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        barcode: '',
        price: 0,
        cost: 0,
        stock: 0,
        categoryId: '',
        hasStock: true,
        isCombo: false
      });
    }
  }, [product]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Product name is required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // This would be replaced with an actual API call
      console.log('Saving product:', formData);
      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to ${product ? 'update' : 'create'} product`);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update product details below.' : 'Enter product details below to add a new product.'}
            {currentLocation && <span className="font-medium"> - {currentLocation.name}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                placeholder="Barcode"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Uncategorized</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleNumberChange}
                disabled={!formData.hasStock}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasStock"
                checked={formData.hasStock}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('hasStock', checked as boolean)
                }
              />
              <Label htmlFor="hasStock">Track Stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCombo"
                checked={formData.isCombo}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('isCombo', checked as boolean)
                }
              />
              <Label htmlFor="isCombo">Is Combo Product</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
