
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Filter, Calendar, AlertTriangle } from 'lucide-react';
import { format, parseISO, isAfter, addDays, isBefore } from 'date-fns';
import { ProductBatch, mapDbProductBatchToModel } from '@/models/productBatch';
import { Product, productsService } from '@/models/product';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { asParams } from '@/utils/supabaseUtils';
import BatchStatusBadge from '@/components/inventory/expiration/BatchStatusBadge';

const ProductBatchDashboard = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDays, setFilterDays] = useState<number | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // First check if the product_batches table exists
        const { data: tableExists, error: checkError } = await supabase
          .rpc('check_table_exists', asParams({ 
            table_name: 'product_batches' 
          }));
          
        if (checkError) {
          console.error('Error checking table:', checkError);
          toast.error('Failed to check if batches table exists');
          setIsLoading(false);
          return;
        }
        
        if (!tableExists) {
          toast.error('Product batches table does not exist yet. Please run the database migration.');
          setIsLoading(false);
          return;
        }

        // Load batches
        const { data: batchesData, error: batchesError } = await supabase
          .rpc('get_all_product_batches', {});
        
        if (batchesError) {
          console.error('Error loading batches:', batchesError);
          toast.error('Failed to load product batches');
          setIsLoading(false);
          return;
        }

        // Load products to get product names
        const allProducts = await productsService.getAll();
        setProducts(allProducts);
        
        // Map the batches data and set state
        const mappedBatches = batchesData && Array.isArray(batchesData) 
          ? batchesData.map(batch => mapDbProductBatchToModel(batch))
          : [];
          
        setBatches(mappedBatches);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter batches based on search term and expiry filter
  const filteredBatches = batches.filter(batch => {
    // Get product info for this batch
    const product = products.find(p => p.id === batch.productId);
    
    // Apply search filter
    const matchesSearch = 
      !searchTerm || 
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
    // Apply days filter
    const matchesDaysFilter = !filterDays || (
      batch.expiryDate && 
      isBefore(new Date(), parseISO(batch.expiryDate)) && 
      isBefore(parseISO(batch.expiryDate), addDays(new Date(), filterDays))
    );
    
    return matchesSearch && matchesDaysFilter;
  });
  
  // Get expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = parseISO(expiryDate);
    
    if (isBefore(expiry, now)) {
      return 'expired';
    } else if (isBefore(expiry, addDays(now, 30))) {
      return 'expiring-soon';
    } else {
      return 'valid';
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Product Batch Dashboard</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterDays === 30 ? "default" : "outline"} 
            onClick={() => setFilterDays(filterDays === 30 ? null : 30)}
            className="flex gap-2 items-center"
          >
            <Calendar className="h-4 w-4" />
            Expiring in 30 days
          </Button>
          
          <Button 
            variant={filterDays === 90 ? "default" : "outline"} 
            onClick={() => setFilterDays(filterDays === 90 ? null : 90)}
            className="flex gap-2 items-center"
          >
            <Calendar className="h-4 w-4" />
            Expiring in 90 days
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Product Batches and Expiration Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium">No product batches found</h3>
              <p className="text-muted-foreground mt-1">
                You need to add product batches to track expiration dates.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => {
                  const product = products.find(p => p.id === batch.productId);
                  const expiryStatus = getExpiryStatus(batch.expiryDate);
                  
                  return (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">
                        {product?.name || 'Unknown Product'}
                      </TableCell>
                      <TableCell>{batch.batchNumber}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>
                        {format(parseISO(batch.expiryDate), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <BatchStatusBadge expiryDate={batch.expiryDate} />
                      </TableCell>
                      <TableCell>
                        {format(parseISO(batch.createdAt), 'PP')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductBatchDashboard;
