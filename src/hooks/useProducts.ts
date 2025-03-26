
import { useState, useEffect } from 'react';
import { Product, productsService } from '@/models/product';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsService.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time subscription for product changes
    const channel = supabase
      .channel('product-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, (payload) => {
        // Refresh products when changes occur
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError('Failed to refresh products');
    } finally {
      setIsLoading(false);
    }
  };

  return { products, isLoading, error, refreshProducts };
};

export default useProducts;
