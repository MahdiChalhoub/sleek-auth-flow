
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import BatchTable from './BatchTable';
import BatchForm from './BatchForm';
import { Product, ProductBatch, productsService } from '@/models/product';
import { supabase } from '@/lib/supabase';

interface ExpirationManagementProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

const ExpirationManagement: React.FC<ExpirationManagementProps> = ({ product, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [batches, setBatches] = useState<ProductBatch[]>(product.batches || []);
  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const fetchedBatches = await productsService.getProductBatches(product.id);
        setBatches(fetchedBatches);
      } catch (error) {
        console.error('Error fetching batches:', error);
        toast.error('Failed to load product batches');
      }
    };
    
    fetchBatches();
  }, [product.id]);
  
  const handleAddBatch = async (newBatch: Omit<ProductBatch, "id">) => {
    try {
      // Insert the batch into Supabase
      const { data, error } = await supabase
        .from('product_batches')
        .insert([{
          product_id: newBatch.productId,
          batch_number: newBatch.batchNumber,
          quantity: newBatch.quantity,
          expiry_date: newBatch.expiryDate,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Create a new batch with returned data
      const batchWithId: ProductBatch = {
        id: data.id,
        productId: data.product_id,
        batchNumber: data.batch_number,
        quantity: data.quantity,
        expiryDate: data.expiry_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      // Add the new batch to the list
      const updatedBatches = [...batches, batchWithId];
      setBatches(updatedBatches);
      
      // Update the product with the new batch
      const updatedProduct = {
        ...product,
        batches: updatedBatches
      };
      
      onUpdate(updatedProduct);
      
      // Switch back to view tab
      setActiveTab('view');
      
      toast.success('Lot ajouté avec succès', {
        description: `Le lot ${batchWithId.batchNumber} a été ajouté.`
      });
    } catch (error) {
      console.error('Error adding batch:', error);
      toast.error('Failed to add new batch');
    }
  };
  
  const handleDeleteBatch = async (batchId: string) => {
    try {
      // Delete the batch from Supabase
      const { error } = await supabase
        .from('product_batches')
        .delete()
        .eq('id', batchId);
      
      if (error) throw error;
      
      // Filter out the batch to delete
      const updatedBatches = batches.filter(batch => batch.id !== batchId);
      setBatches(updatedBatches);
      
      // Update the product with the filtered batches
      const updatedProduct = {
        ...product,
        batches: updatedBatches
      };
      
      onUpdate(updatedProduct);
      
      toast.success('Lot supprimé', {
        description: 'Le lot a été supprimé avec succès.'
      });
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Failed to delete batch');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des lots et dates d'expiration</CardTitle>
        {activeTab === 'view' && (
          <Button 
            size="sm" 
            onClick={() => setActiveTab('add')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un lot
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'view' | 'add')}>
          <TabsList className="mb-4">
            <TabsTrigger value="view">Lots existants</TabsTrigger>
            <TabsTrigger value="add">Ajouter un lot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            <BatchTable 
              batches={batches} 
              product={product} 
              onDeleteBatch={handleDeleteBatch} 
            />
          </TabsContent>
          
          <TabsContent value="add">
            <BatchForm 
              onSubmit={handleAddBatch}
              onCancel={() => setActiveTab('view')}
              productId={product.id}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpirationManagement;
