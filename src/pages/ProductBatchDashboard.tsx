import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel } from '@/models/productBatch';
import { getBatchStatus } from '@/utils/expirationUtils';
import { toast } from 'sonner';
import { asParams, safeArray } from '@/utils/supabaseUtils';

const ProductBatchDashboard: React.FC = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchBatches();
  }, []);
  
  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      // Check if table exists first
      const { data: tableExists, error: checkError } = await supabase
        .rpc('check_table_exists', asParams({ 
          table_name: 'product_batches' 
        }));
      
      if (checkError) {
        console.error('Error checking if table exists:', checkError);
        setIsLoading(false);
        return;
      }
      
      if (!tableExists) {
        console.log('Product batches table does not exist yet');
        setIsLoading(false);
        return;
      }
      
      // Fetch all batches
      const { data, error } = await supabase
        .rpc('get_all_product_batches', {});
      
      if (error) {
        console.error('Error fetching batches:', error);
        toast.error('Failed to load batches');
        setIsLoading(false);
        return;
      }
      
      const fetchedBatches = safeArray(data, mapDbProductBatchToModel);
      setBatches(fetchedBatches);
    } catch (error) {
      console.error('Error in fetchBatches:', error);
      toast.error('Error loading batches');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Group batches by status
  const expiredBatches = batches.filter(batch => getBatchStatus(batch.expiryDate) === 'expired');
  const expiringSoonBatches = batches.filter(batch => getBatchStatus(batch.expiryDate) === 'expiring_soon');
  const freshBatches = batches.filter(batch => getBatchStatus(batch.expiryDate) === 'fresh');
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Product Batch Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Expired</CardTitle>
            <CardDescription>{expiredBatches.length} batches</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {expiredBatches.length > 0 ? (
              <ul className="space-y-2">
                {expiredBatches.map(batch => (
                  <li key={batch.id} className="p-2 border border-red-100 rounded text-sm">
                    <div>Batch: {batch.batchNumber}</div>
                    <div>Expiry: {new Date(batch.expiryDate).toLocaleDateString()}</div>
                    <div>Quantity: {batch.quantity}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No expired batches</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700">Expiring Soon</CardTitle>
            <CardDescription>{expiringSoonBatches.length} batches</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {expiringSoonBatches.length > 0 ? (
              <ul className="space-y-2">
                {expiringSoonBatches.map(batch => (
                  <li key={batch.id} className="p-2 border border-amber-100 rounded text-sm">
                    <div>Batch: {batch.batchNumber}</div>
                    <div>Expiry: {new Date(batch.expiryDate).toLocaleDateString()}</div>
                    <div>Quantity: {batch.quantity}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No batches expiring soon</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">Fresh</CardTitle>
            <CardDescription>{freshBatches.length} batches</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {freshBatches.length > 0 ? (
              <ul className="space-y-2">
                {freshBatches.map(batch => (
                  <li key={batch.id} className="p-2 border border-green-100 rounded text-sm">
                    <div>Batch: {batch.batchNumber}</div>
                    <div>Expiry: {new Date(batch.expiryDate).toLocaleDateString()}</div>
                    <div>Quantity: {batch.quantity}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No fresh batches</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        {isLoading ? (
          <div>Loading batches...</div>
        ) : (
          batches.length === 0 && (
            <div>No batches found. Please run the database migration first.</div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductBatchDashboard;
