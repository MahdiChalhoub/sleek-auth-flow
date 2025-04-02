
// Update component to fix ComboComponent import and property issues
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/models/product';

// Define ComboComponent interface
export interface ComboComponent {
  id?: string;
  productId: string;
  componentId: string;
  componentName: string;
  quantity: number;
}

interface ProductFormModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: { id: string; name: string }[];
  allProducts: Product[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  categories,
  allProducts
}) => {
  // State for product form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  const [isCombo, setIsCombo] = useState(false);
  const [comboComponents, setComboComponents] = useState<ComboComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [componentQuantity, setComponentQuantity] = useState('1');

  // Effect to populate form when product is provided
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price ? product.price.toString() : '');
      setCost(product.cost ? product.cost.toString() : '');
      setStock(product.stock ? product.stock.toString() : '');
      setMinStock(product.minStockLevel ? product.minStockLevel.toString() : '');
      setMaxStock(product.maxStockLevel ? product.maxStockLevel.toString() : '');
      setCategoryId(product.categoryId || '');
      setDescription(product.description || '');
      setBarcode(product.barcode || '');
      setIsCombo(product.isCombo || false);
      // Set combo components if available
      if (product.comboComponents) {
        setComboComponents(product.comboComponents);
      } else {
        setComboComponents([]);
      }
    } else {
      // Reset form for new product
      setName('');
      setPrice('');
      setCost('');
      setStock('');
      setMinStock('');
      setMaxStock('');
      setCategoryId('');
      setDescription('');
      setBarcode('');
      setIsCombo(false);
      setComboComponents([]);
    }
  }, [product]);

  const addComponent = () => {
    if (!selectedComponentId || parseInt(componentQuantity) <= 0) {
      toast.error('Please select a component and specify a valid quantity');
      return;
    }

    const selectedProduct = allProducts.find(p => p.id === selectedComponentId);
    if (!selectedProduct) return;

    // Check if already in the list
    if (comboComponents.some(c => c.componentId === selectedComponentId)) {
      toast.error('This component is already in the list');
      return;
    }

    const newComponent: ComboComponent = {
      productId: product?.id || 'new-product', // Will be updated when product is created
      componentId: selectedProduct.id,
      componentName: selectedProduct.name,
      quantity: parseInt(componentQuantity)
    };

    setComboComponents([...comboComponents, newComponent]);
    setSelectedComponentId('');
    setComponentQuantity('1');
  };

  const removeComponent = (componentId: string) => {
    setComboComponents(comboComponents.filter(c => c.componentId !== componentId));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!name || !price) {
      toast.error('Name and price are required');
      return;
    }

    // Prepare product data
    const productData: Product = {
      id: product?.id || '', // Will be generated if new
      name,
      price: parseFloat(price),
      cost: cost ? parseFloat(cost) : undefined,
      stock: stock ? parseInt(stock) : 0,
      categoryId: categoryId || undefined,
      description,
      barcode,
      isCombo,
      // Only include these for type safety, may not be used in the actual product object
      minStockLevel: minStock ? parseInt(minStock) : undefined,
      maxStockLevel: maxStock ? parseInt(maxStock) : undefined, 
      hasStock: true,
      comboComponents: isCombo ? comboComponents : [],
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(productData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update product details below' : 'Fill in the details for your new product'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Barcode"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxStock">Max Stock</Label>
              <Input
                id="maxStock"
                type="number"
                min="0"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              className="w-full p-2 border rounded min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCombo"
                checked={isCombo}
                onCheckedChange={(checked) => setIsCombo(checked as boolean)}
              />
              <Label htmlFor="isCombo">This is a combo product</Label>
            </div>
          </div>

          {isCombo && (
            <div className="space-y-4 border p-4 rounded">
              <h4 className="font-medium">Combo Components</h4>
              
              <div className="flex space-x-2">
                <select
                  value={selectedComponentId}
                  onChange={(e) => setSelectedComponentId(e.target.value)}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">Select component</option>
                  {allProducts
                    .filter(p => !p.isCombo && (!product || p.id !== product.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                
                <Input
                  type="number"
                  min="1"
                  value={componentQuantity}
                  onChange={(e) => setComponentQuantity(e.target.value)}
                  className="w-24"
                />
                
                <Button type="button" size="sm" onClick={addComponent}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {comboComponents.length === 0 ? (
                  <p className="text-sm text-gray-500">No components added yet</p>
                ) : (
                  <ul className="space-y-2">
                    {comboComponents.map((component) => (
                      <li key={component.componentId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>
                          {component.componentName} x {component.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComponent(component.componentId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
