
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { ProductBatch } from '@/models/productBatch';
import { Product } from '@/models/product';
import useProducts from '@/hooks/useProducts';
import ExpiryDatePicker from './ExpiryDatePicker';
import { parseISO, formatISO } from 'date-fns';

export interface BatchFormProps {
  batch: ProductBatch | null;
  onSave: (batch: ProductBatch) => Promise<void>;
  onCancel: () => void;
  productId?: string;
}

const BatchForm: React.FC<BatchFormProps> = ({ 
  batch, 
  onSave, 
  onCancel,
  productId
}) => {
  const { products, isLoading: productsLoading } = useProducts();
  const [selectedDate, setSelectedDate] = useState<string>(
    batch?.expiryDate || formatISO(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(batch?.productId || productId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<ProductBatch, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: {
      productId: batch?.productId || productId || '',
      batchNumber: batch?.batchNumber || '',
      expiryDate: batch?.expiryDate || '',
      quantity: batch?.quantity || 1
    }
  });
  
  useEffect(() => {
    if (batch) {
      setValue('productId', batch.productId);
      setValue('batchNumber', batch.batchNumber);
      setValue('expiryDate', batch.expiryDate);
      setValue('quantity', batch.quantity);
      setSelectedDate(batch.expiryDate);
      setSelectedProductId(batch.productId);
    } else if (productId) {
      setValue('productId', productId);
      setSelectedProductId(productId);
    }
  }, [batch, productId, setValue]);
  
  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setValue('expiryDate', date);
  };
  
  const onSubmit = async (data: Omit<ProductBatch, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      const batchData: ProductBatch = {
        ...data,
        id: batch?.id || '',
        createdAt: batch?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSave(batchData);
    } catch (error) {
      console.error('Error saving batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productId">Product</Label>
        <Select
          value={selectedProductId}
          onValueChange={(value) => {
            setSelectedProductId(value);
            setValue('productId', value);
          }}
          disabled={!!productId || productsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productId && <p className="text-red-500 text-sm">Product is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="batchNumber">Batch Number</Label>
        <Input
          id="batchNumber"
          placeholder="e.g., LOT12345"
          {...register('batchNumber', { required: true })}
        />
        {errors.batchNumber && <p className="text-red-500 text-sm">Batch number is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <ExpiryDatePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
        {errors.expiryDate && <p className="text-red-500 text-sm">Expiry date is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          {...register('quantity', { 
            required: true,
            min: 1,
            valueAsNumber: true
          })}
        />
        {errors.quantity && <p className="text-red-500 text-sm">Valid quantity is required</p>}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : batch ? 'Update Batch' : 'Add Batch'}
        </Button>
      </div>
    </form>
  );
};

export default BatchForm;
