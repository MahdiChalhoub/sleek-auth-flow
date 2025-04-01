
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mapDbProductBatchToModel, ProductBatch } from '@/models/productBatch';
import { safeArray, rpcParams, tableSource } from '@/utils/supabaseUtils';
import { getBatchStatus, formatDaysUntilExpiry } from '@/utils/expirationUtils';
import { productsService } from '@/models/product';
import { Spinner } from '@/components/ui/spinner';

interface ExpiryDashboardProps {
  // Define any props here
}

const ExpiryDashboard: React.FC<ExpiryDashboardProps> = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBatches = async () => {
      setIsLoading(true);
      try {
        const { data: tableExists, error: tableCheckError } = await supabase
          .rpc('check_table_exists', rpcParams({
            table_name: 'product_batches'
          }));
        
        if (tableCheckError) {
          console.error('Error checking if table exists:', tableCheckError);
          setIsLoading(false);
          return;
        }
        
        if (!tableExists) {
          console.log('product_batches table does not exist yet');
          setIsLoading(false);
          return;
        }
        
        const { data: batchesData, error } = await supabase
          .rpc('get_all_product_batches', rpcParams({}));
        
        if (error) {
          throw error;
        }
        
        // Add explicit check for array before mapping
        const fetchedBatches = safeArray(batchesData, mapDbProductBatchToModel);
        
        // Fetch product names for each batch
        const batchesWithProductNames = await Promise.all(
          fetchedBatches.map(async (batch) => {
            const product = await productsService.getById(batch.productId);
            return {
              ...batch,
              productName: product?.name || 'Unknown'
            };
          })
        );

        setBatches(batchesWithProductNames as ProductBatch[]);
      } catch (error) {
        console.error('Error loading batches:', error);
        toast.error('Failed to load product batches');
      } finally {
        setIsLoading(false);
      }
    };

    loadBatches();
  }, []);

  // Update the fetchBatches function with proper typing
  const fetchBatches = async (): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_all_product_batches', rpcParams({}));
      
      if (error) {
        throw error;
      }
      
      return safeArray(data, mapDbProductBatchToModel);
    } catch (error) {
      console.error('Error fetching product batches:', error);
      toast.error('Failed to load product batches');
      return [];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expiry Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        ) : (
          batches.length > 0 ? (
            <ul>
              {batches.map(batch => (
                <li key={batch.id} className="mb-2 p-2 border rounded">
                  <div className="font-medium">Product: {(batch as any).productName || 'Unknown'}</div>
                  <div>Batch Number: {batch.batchNumber}</div>
                  <div>Expiry Date: {batch.expiryDate}</div>
                  <div>{formatDaysUntilExpiry(batch.expiryDate)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div>No batches found. Please run the database migration first.</div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiryDashboard;
