
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ProductBatch } from '@/models/productBatch';
import ExpiryDatePicker from './ExpiryDatePicker';
import { parseISO, formatISO, addDays } from 'date-fns';

export interface BatchFormProps {
  batch: ProductBatch | null;
  onSave: (batch: Omit<ProductBatch, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  productId?: string;
}

const BatchForm: React.FC<BatchFormProps> = ({ 
  batch, 
  onSave, 
  onCancel,
  productId
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    batch?.expiryDate || formatISO(addDays(new Date(), 90))
  );
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
      expiryDate: batch?.expiryDate || selectedDate,
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
    } else if (productId) {
      setValue('productId', productId);
    }
  }, [batch, productId, setValue]);
  
  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setValue('expiryDate', date);
  };
  
  const onSubmit = async (data: Omit<ProductBatch, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await onSave({
        ...data,
        expiryDate: selectedDate // Make sure we use the selected date from the date picker
      });
      reset();
    } catch (error) {
      console.error('Error saving batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input 
        type="hidden" 
        {...register('productId')} 
        value={productId || batch?.productId || ''} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="batchNumber">Batch Number</Label>
        <Input
          id="batchNumber"
          placeholder="LOT12345"
          {...register('batchNumber', { required: 'Batch number is required' })}
        />
        {errors.batchNumber && (
          <p className="text-sm text-red-500">{errors.batchNumber.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <ExpiryDatePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          {...register('quantity', { 
            required: 'Quantity is required', 
            min: { value: 1, message: 'Quantity must be at least 1' },
            valueAsNumber: true 
          })}
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity.message}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Batch'}
        </Button>
      </div>
    </form>
  );
};

export default BatchForm;
