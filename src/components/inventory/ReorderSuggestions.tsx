
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export interface ReorderSuggestionsProps {
  locationId: string;
  showAll?: boolean;
  onReorderAll?: () => void;
}

const ReorderSuggestions: React.FC<ReorderSuggestionsProps> = ({ 
  locationId, 
  showAll = false,
  onReorderAll
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();
  }, [locationId, showAll]);

  const fetchLowStockProducts = async () => {
    setLoading(true);
    try {
      // Fetch low stock products for the given location
      const { data, error } = await supabase
        .from('product_location_stock')
        .select(`
          id,
          stock,
          min_stock_level,
          product:product_id (id, name, barcode, cost)
        `)
        .eq('location_id', locationId)
        .lt('stock', supabase.raw('min_stock_level'))
        .order('stock', { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      toast.error('Failed to load reorder suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLowStockProducts().finally(() => {
      setRefreshing(false);
      toast.success('Reorder suggestions refreshed');
    });
  };

  const handleReorderAll = () => {
    if (onReorderAll) {
      onReorderAll();
    } else {
      toast.info('Create purchase order feature coming soon');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Reorder Suggestions</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 md:inline hidden">Refresh</span>
          </Button>
          <Button size="sm" onClick={handleReorderAll}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Reorder All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No low stock products found. All inventory levels are healthy!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Min Level</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.slice(0, showAll ? undefined : 5).map((item) => {
                const variance = item.stock - item.min_stock_level;
                const status = 
                  variance <= -10 ? 'critical' : 
                  variance <= -5 ? 'urgent' : 
                  variance < 0 ? 'low' : 'ok';
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="text-right">{item.stock}</TableCell>
                    <TableCell className="text-right">{item.min_stock_level}</TableCell>
                    <TableCell className="text-right">{variance}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={
                        status === 'critical' ? 'destructive' : 
                        status === 'urgent' ? 'destructive' : 
                        status === 'low' ? 'warning' : 
                        'outline'
                      }>
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        
        {!showAll && products.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => {}}>
              View all {products.length} items
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReorderSuggestions;
