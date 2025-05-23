import React, { useState, useEffect } from 'react';
import { ProductBatch, mapDbProductBatchToModel } from '@/models/productBatch';
import { safeArray } from '@/utils/supabaseUtils';
import { toast } from 'sonner';
import BatchTable from '@/components/inventory/expiration/BatchTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Product } from '@/models/product';
import { productsService } from '@/models/product';
import { callRPC } from '@/utils/rpcUtils';

const ProductBatchDashboard: React.FC = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check if the table exists
        const tableExists = await callRPC<boolean>('check_table_exists', { table_name: 'product_batches' });
        
        if (!tableExists) {
          console.log('product_batches table does not exist yet');
          toast.warning('Product batches database table not found');
          setIsLoading(false);
          return;
        }
        
        // Fetch batches
        const batchesData = await callRPC<any[]>('get_all_product_batches', {});
        
        const fetchedBatches = safeArray(batchesData || [], mapDbProductBatchToModel);
        
        // Get unique product IDs
        const productIds = [...new Set(fetchedBatches.map(batch => batch.productId))];
        
        // Fetch product details
        const productsMap: Record<string, Product> = {};
        for (const productId of productIds) {
          const product = await productsService.getById(productId);
          if (product) {
            productsMap[productId] = product;
          }
        }
        
        setProducts(productsMap);
        setBatches(fetchedBatches);
      } catch (error) {
        console.error('Error loading batch data:', error);
        toast.error('Failed to load product batches');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteBatch = async (batchId: string) => {
    try {
      await callRPC<any>('delete_product_batch', { batch_id: batchId });
      
      toast.success('Batch deleted successfully');
      // Remove the batch from state
      setBatches(prev => prev.filter(batch => batch.id !== batchId));
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Failed to delete batch');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Batch Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : batches.length > 0 ? (
            <BatchTable 
              batches={batches} 
              isLoading={isLoading}
              onDelete={handleDeleteBatch}
              product={undefined}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No product batches found.</p>
              <p className="mt-2">If you've just set up the database, try adding your first batch.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductBatchDashboard;
