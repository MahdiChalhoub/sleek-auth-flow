
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { mapDbProductBatchToModel, ProductBatch } from '@/models/productBatch';
import BatchTable from './BatchTable';
import BatchForm from './BatchForm';
import ExpiryAlertSettings from './ExpiryAlertSettings';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { asParams, safeArray } from '@/utils/supabaseUtils';

const ExpirationManagement: React.FC = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      // First check if the product_batches table exists
      const { data: tableExists, error: checkError } = await supabase
        .rpc('check_table_exists', asParams({ 
          table_name: 'product_batches' 
        }));
      
      if (checkError) {
        console.error("Error checking if table exists:", checkError);
        setIsLoading(false);
        return;
      }
      
      if (!tableExists) {
        toast.error("Product batches table not found. Please run the database migration first.");
        setIsLoading(false);
        return;
      }
      
      // Get all batches
      const { data, error } = await supabase
        .rpc('get_all_product_batches', {});
      
      if (error) {
        console.error("Error fetching batches:", error);
        toast.error(`Error fetching batches: ${error.message}`);
        setIsLoading(false);
        return;
      }
      
      // Map database records to product batch model
      const productBatches = safeArray(data, mapDbProductBatchToModel);
      setBatches(productBatches);
    } catch (error) {
      console.error("Error in fetchBatches:", error);
      toast.error("Error loading batches. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBatch = (batch: ProductBatch) => {
    setSelectedBatch(batch);
    setIsFormOpen(true);
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const { error } = await supabase
        .rpc('delete_product_batch', asParams({ 
          batch_id: batchId 
        }));
      
      if (error) throw error;
      
      toast.success('Batch deleted successfully');
      fetchBatches();
    } catch (error: any) {
      console.error('Error deleting batch:', error);
      toast.error(`Failed to delete batch: ${error.message}`);
    }
  };

  const handleAddEditBatch = async (batch: ProductBatch) => {
    try {
      if (batch.id) {
        // Update existing batch
        const { error } = await supabase.rpc(
          'update_product_batch',
          asParams({
            batch_id: batch.id,
            product_id: batch.productId,
            batch_number: batch.batchNumber,
            expiry_date: batch.expiryDate,
            quantity: batch.quantity
          })
        );
        
        if (error) throw error;
        toast.success('Batch updated successfully');
      } else {
        // Create new batch
        const { error } = await supabase.rpc(
          'create_product_batch',
          asParams({
            product_id: batch.productId,
            batch_number: batch.batchNumber,
            expiry_date: batch.expiryDate,
            quantity: batch.quantity
          })
        );
        
        if (error) throw error;
        toast.success('Batch added successfully');
      }
      
      setIsFormOpen(false);
      setSelectedBatch(null);
      fetchBatches();
    } catch (error: any) {
      console.error('Error saving batch:', error);
      toast.error(`Failed to save batch: ${error.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expiration Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="batches">
          <TabsList>
            <TabsTrigger value="batches">Product Batches</TabsTrigger>
            <TabsTrigger value="settings">Alert Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="batches" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Batches</h2>
              <div className="space-x-2">
                <Button 
                  onClick={() => {
                    setSelectedBatch(null);
                    setIsFormOpen(true);
                  }}
                >
                  Add New Batch
                </Button>
                <Button 
                  variant="outline"
                  onClick={fetchBatches}
                >
                  Refresh
                </Button>
              </div>
            </div>
            
            <BatchTable 
              batches={batches} 
              isLoading={isLoading} 
              onEdit={handleEditBatch}
              onDelete={handleDeleteBatch}
            />
            
            {isFormOpen && (
              <BatchForm 
                batch={selectedBatch} 
                onSave={handleAddEditBatch}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedBatch(null);
                }}
              />
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <ExpiryAlertSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpirationManagement;
