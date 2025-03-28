
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import BatchTable from './BatchTable';
import BatchForm from './BatchForm';
import { Product } from '@/models/product';
import { ProductBatch, mapModelProductBatchToDb, mapDbProductBatchToModel } from '@/models/productBatch';
import { supabase } from '@/lib/supabase';

interface ExpirationManagementProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

const ExpirationManagement: React.FC<ExpirationManagementProps> = ({ product, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [batches, setBatches] = useState<ProductBatch[]>(product.batches || []);
  const [tableExists, setTableExists] = useState(false);
  
  useEffect(() => {
    const checkTableAndFetchBatches = async () => {
      try {
        // Check if product_batches table exists
        const { data: tableExists, error: checkError } = await supabase
          .rpc('check_table_exists', { table_name: 'product_batches' });
        
        if (checkError) {
          console.error("Error checking if table exists:", checkError);
          return;
        }
        
        setTableExists(!!tableExists);
        
        if (!tableExists) {
          console.log("product_batches table doesn't exist");
          toast.error('Product batches table does not exist. Please create it first.');
          return;
        }
        
        // Fetch batches if table exists
        const { data, error } = await supabase
          .from('product_batches')
          .select('*')
          .eq('product_id', product.id);
        
        if (error) {
          console.error("Error fetching batches:", error);
          toast.error('Failed to load product batches');
          return;
        }
        
        const mappedBatches = data.map(mapDbProductBatchToModel);
        setBatches(mappedBatches);
      } catch (error) {
        console.error('Error in initialization:', error);
        toast.error('Failed during initialization');
      }
    };
    
    checkTableAndFetchBatches();
  }, [product.id]);
  
  const handleAddBatch = async (newBatch: Omit<ProductBatch, "id">) => {
    if (!tableExists) {
      toast.error('Product batches table does not exist. Please create it first.');
      return;
    }
    
    try {
      // Convert the model to database format for insertion
      const dbBatch = mapModelProductBatchToDb(newBatch);
      
      // Insert the batch into Supabase using non-typed approach
      const { data, error } = await supabase
        .from('product_batches')
        .insert([dbBatch])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map the database response back to our model
      const batchWithId = mapDbProductBatchToModel(data);
      
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
    if (!tableExists) {
      toast.error('Product batches table does not exist. Please create it first.');
      return;
    }
    
    try {
      // Delete the batch from Supabase using non-typed approach
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
        {activeTab === 'view' && tableExists && (
          <Button 
            size="sm" 
            onClick={() => setActiveTab('add')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un lot
          </Button>
        )}
        {!tableExists && (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => {
              toast.info('Please create the product_batches table first using the provided SQL migration');
            }}
          >
            Setup Required
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!tableExists ? (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <h3 className="font-medium">Database Setup Required</h3>
            <p className="mt-1">The product batches table doesn't exist in your database. Please run the migration to create it first.</p>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ExpirationManagement;
