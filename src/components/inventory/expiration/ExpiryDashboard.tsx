
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mapDbProductBatchToModel, ProductBatch } from '@/models/productBatch';

// Define interfaces for RPC parameters and returns to properly type the calls
interface CheckTableExistsParams {
  table_name: string;
}

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
        // Use type parameter only for the return type, not parameters
        const { data, error: tableCheckError } = await supabase
          .rpc('check_table_exists', { 
            table_name: 'product_batches' 
          });
        
        if (tableCheckError) {
          console.error('Error checking if table exists:', tableCheckError);
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          console.log('product_batches table does not exist yet');
          setIsLoading(false);
          return;
        }
        
        const fetchedBatches = await fetchBatches();
        setBatches(fetchedBatches);
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
      // Remove type parameters entirely for simplicity
      const { data, error } = await supabase.rpc('get_all_product_batches');
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return [];
      }
      
      // Add explicit check for array before mapping
      return Array.isArray(data) ? data.map(mapDbProductBatchToModel) : [];
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
          <div>Loading batches...</div>
        ) : (
          batches.length > 0 ? (
            <ul>
              {batches.map(batch => (
                <li key={batch.id}>
                  Batch Number: {batch.batchNumber}, Expiry Date: {batch.expiryDate}
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
