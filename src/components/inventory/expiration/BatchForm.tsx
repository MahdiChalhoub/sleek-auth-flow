
import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProductBatch } from '@/models/productBatch';
import ExpiryDatePicker from './ExpiryDatePicker';

const formSchema = z.object({
  batchNumber: z.string().min(1, "Batch number is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  expiryDate: z.date({
    required_error: "Please select an expiry date",
  }),
});

export type BatchFormData = z.infer<typeof formSchema>;

export interface BatchFormProps {
  onSubmit: (newBatch: Omit<ProductBatch, "id">) => void;
  onCancel: () => void;
  productId: string;
}

const BatchForm: React.FC<BatchFormProps> = ({ onSubmit, onCancel, productId }) => {
  const form = useForm<BatchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchNumber: '',
      quantity: 1,
    },
  });

  const handleSubmit = (data: BatchFormData) => {
    const now = new Date().toISOString();
    onSubmit({
      productId,
      batchNumber: data.batchNumber,
      quantity: data.quantity,
      expiryDate: data.expiryDate.toISOString(),
      createdAt: now,
      updatedAt: now,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter batch number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1}
                  placeholder="Enter quantity" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <ExpiryDatePicker
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">Add Batch</Button>
        </div>
      </form>
    </Form>
  );
};

export default BatchForm;
