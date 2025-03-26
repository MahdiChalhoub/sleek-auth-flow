import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product, productsService } from '@/models/product';
import { useToast } from '@/components/ui/use-toast';

export interface ReorderSuggestionsProps {
  locationId: string | null;
  showAll?: boolean;
  onReorderAll?: () => void;
}

const ReorderSuggestions: React.FC<ReorderSuggestionsProps> = ({ 
  locationId, 
  showAll = false,
  onReorderAll
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!locationId) return;
      
      setLoading(true);
      try {
        // Fetch products with low stock from Supabase
        const { data, error } = await supabase
          .from('product_location_stock')
          .select(`
            *,
            products:product_id(
              id, name, barcode, price, cost, description, image_url, 
              category_id, categories:category_id(name)
            )
          `)
          .eq('location_id', locationId)
          .lt('stock', 'min_stock_level')
          .order('stock', { ascending: true });
          
        if (error) throw error;
        
        // Transform the data to match our Product interface
        const lowStockProducts = data.map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          description: item.products.description,
          barcode: item.products.barcode,
          categoryId: item.products.category_id,
          category: item.products.categories?.name,
          price: item.products.price,
          cost: item.products.cost,
          stock: item.stock,
          minStockLevel: item.min_stock_level,
          imageUrl: item.products.image_url,
          image: item.products.image_url,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          locationStock: [{
            id: item.id,
            productId: item.product_id,
            locationId: item.location_id,
            stock: item.stock,
            minStockLevel: item.min_stock_level,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }]
        }));
        
        setProducts(lowStockProducts);
      } catch (error) {
        console.error('Error fetching low stock products:', error);
        toast({
          variant: "destructive",
          title: "Failed to load reorder suggestions",
          description: "Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [locationId, toast]);

  const getStockStatus = (product: Product) => {
    const locationStockItem = product.locationStock?.[0];
    
    if (!locationStockItem) return 'normal';
    
    if (locationStockItem.stock <= 0) return 'out';
    if (locationStockItem.stock < (locationStockItem.minStockLevel || 5)) return 'low';
    
    return 'normal';
  };

  const handleReorder = (productId: string) => {
    toast({
      title: "Added to purchase order",
      description: "The item has been added to your draft purchase order."
    });
  };

  const renderStockBadge = (status: string) => {
    if (status === 'out') {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (status === 'low') {
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reorder Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reorder Suggestions</CardTitle>
        {onReorderAll && products.length > 0 && (
          <Button size="sm" onClick={onReorderAll}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Reorder All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>No reorder suggestions at this time.</p>
            <p className="text-sm">All stock levels are within acceptable limits.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const status = getStockStatus(product);
                  const locationStockItem = product.locationStock?.[0];
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{locationStockItem?.stock || 0}</TableCell>
                      <TableCell>{locationStockItem?.minStockLevel || 5}</TableCell>
                      <TableCell>{renderStockBadge(status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(product.id)}
                        >
                          Reorder
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReorderSuggestions;
