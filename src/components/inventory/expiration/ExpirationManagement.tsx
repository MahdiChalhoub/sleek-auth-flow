
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import BatchTable from './BatchTable';
import BatchForm from './BatchForm';
import { Product, ProductBatch } from '@/models/product';

interface ExpirationManagementProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

const ExpirationManagement: React.FC<ExpirationManagementProps> = ({ product, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [batches, setBatches] = useState<ProductBatch[]>(product.batches || []);
  
  useEffect(() => {
    setBatches(product.batches || []);
  }, [product]);
  
  const handleAddBatch = (newBatch: Omit<ProductBatch, "id">) => {
    // Create a new batch with a unique ID
    const batchWithId: ProductBatch = {
      ...newBatch,
      id: crypto.randomUUID()
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
  };
  
  const handleDeleteBatch = (batchId: string) => {
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
