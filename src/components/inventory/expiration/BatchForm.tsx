
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductBatch, createProductBatch } from '@/models/productBatch';
import { useProducts } from '@/hooks/useProducts';
import ExpiryDatePicker from './ExpiryDatePicker';

export interface BatchFormProps {
  batch: ProductBatch | null;
  onSave: (batch: ProductBatch) => Promise<void>;
  onCancel: () => void;
}

const BatchForm: React.FC<BatchFormProps> = ({ batch, onSave, onCancel }) => {
  const { products } = useProducts();
  const [formData, setFormData] = useState<ProductBatch>(
    batch || createProductBatch({})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update form when batch prop changes
    if (batch) {
      setFormData(batch);
    } else {
      setFormData(createProductBatch({}));
    }
  }, [batch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, expiryDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNew = !batch?.id;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isNew ? 'Add New Batch' : 'Edit Batch'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product</Label>
            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="Enter batch number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <ExpiryDatePicker 
              selectedDate={formData.expiryDate} 
              onDateChange={handleDateChange} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isNew ? 'Add Batch' : 'Update Batch'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BatchForm;
