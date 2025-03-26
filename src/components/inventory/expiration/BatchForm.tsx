
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ExpiryDatePicker from './ExpiryDatePicker';
import { ProductBatch } from '@/models/product';

// Define schema for batch form
const batchFormSchema = z.object({
  batchNumber: z.string().min(1, "Le numéro de lot est requis"),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  expiryDate: z.date().refine(date => date > new Date(), {
    message: "La date d'expiration doit être future"
  })
});

export type BatchFormValues = z.infer<typeof batchFormSchema>;

export interface BatchFormProps {
  onSubmit: (newBatch: Omit<ProductBatch, "id">) => void;
  onCancel: () => void;
  productId: string;
}

const BatchForm: React.FC<BatchFormProps> = ({ onSubmit, onCancel, productId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      batchNumber: '',
      quantity: 1,
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) // Default 3 months ahead
    }
  });
  
  const handleSubmit = async (values: BatchFormValues) => {
    setIsSubmitting(true);
    try {
      const newBatch: Omit<ProductBatch, "id"> = {
        productId,
        batchNumber: values.batchNumber,
        quantity: values.quantity,
        expiryDate: values.expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      onSubmit(newBatch);
      form.reset();
    } catch (error) {
      console.error('Failed to add batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ajouter un lot</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="batchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de lot</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="EX123456" />
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
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'expiration</FormLabel>
                  <FormControl>
                    <ExpiryDatePicker 
                      date={field.value} 
                      onDateChange={field.onChange} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default BatchForm;
