
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
        const { data: tableCheck, error: tableCheckError } = await supabase
          .rpc('check_table_exists', { table_name: 'product_batches' });
        
        if (tableCheckError) {
          console.error('Error checking if table exists:', tableCheckError);
          setIsLoading(false);
          return;
        }
        
        if (!tableCheck) {
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
  const fetchBatches = async () => {
    try {
      // Check if the table exists first by querying information_schema
      const { data: tables, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'product_batches')
        .eq('table_schema', 'public');
      
      if (schemaError) {
        console.error('Error checking schema:', schemaError);
        return [];
      }
      
      if (!tables || tables.length === 0) {
        console.log('product_batches table not found in database');
        return [];
      }
      
      // Table exists, proceed with the fetch
      const { data, error } = await supabase
        .from('product_batches')
        .select('*')
        .order('expiry_date', { ascending: true });
      
      if (error) {
        throw error;
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
