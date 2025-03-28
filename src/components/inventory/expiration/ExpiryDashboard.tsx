
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mapDbProductBatchToModel, ProductBatch } from '@/models/productBatch';

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
        // Create SQL to check if product_batches table exists
        const { data, error: tableCheckError } = await supabase
          .rpc('check_table_exists', { table_name: 'product_batches' });
        
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

  // Update the fetchBatches function
  const fetchBatches = async (): Promise<ProductBatch[]> => {
    try {
      // Use custom RPC to get all batches
      const { data, error } = await supabase.rpc('get_all_product_batches');
      
      if (error) {
        throw error;
      }
      
      // If the function doesn't exist yet, try a different approach
      if (!data || !Array.isArray(data)) {
        console.log('get_all_product_batches function not available, using direct SQL query');
        
        // Execute direct SQL query via function
        const result = await supabase.rpc('execute_sql_safely', {
          sql_query: 'SELECT * FROM product_batches ORDER BY expiry_date ASC'
        });
        
        if (result.error) throw result.error;
        
        // Make sure to check if result.data exists and is an array
        if (result.data && Array.isArray(result.data)) {
          return result.data.map(mapDbProductBatchToModel);
        } else {
          return [];
        }
      }
      
      return data.map(mapDbProductBatchToModel);
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
