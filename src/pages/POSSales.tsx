
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCardPOS from '@/components/POS/ProductCardPOS';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the Product type
import { Product } from '@/models/interfaces/productInterfaces';

const POSSales = () => {
  // Add fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast.error("Error attempting to enable fullscreen mode:", err.message);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const { products, isLoading: isLoadingProducts, error: productsError } = useProducts();
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  useEffect(() => {
    if (products) {
      // Convert returned products to the expected Product interface
      const convertedProducts = products.map(p => ({
        ...p,
        has_stock: typeof p.has_stock !== 'undefined' ? p.has_stock : true,
      })) as unknown as Product[];
      setFilteredProducts(convertedProducts);
    }
  }, [products]);

  // Update the category filtering functions to work with the category object
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category === null) {
      // Convert to expected Product interface
      const convertedProducts = products.map(p => ({
        ...p,
        has_stock: typeof p.has_stock !== 'undefined' ? p.has_stock : true,
      })) as unknown as Product[];
      setFilteredProducts(convertedProducts);
    } else {
      const filtered = products.filter((product) => 
        product.categoryId && product.categoryId === category
      );
      // Convert to expected Product interface
      const convertedFiltered = filtered.map(p => ({
        ...p,
        has_stock: typeof p.has_stock !== 'undefined' ? p.has_stock : true,
      })) as unknown as Product[];
      setFilteredProducts(convertedFiltered);
    }
  };

  // And update the search function as well
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    let filtered = products;
    
    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter((product) => 
        product.categoryId && product.categoryId === selectedCategory
      );
    }
    
    // Apply search filter
    if (query.trim() !== "") {
      filtered = filtered.filter((product) => 
        product.name.toLowerCase().includes(query) || 
        product.barcode?.toLowerCase().includes(query)
      );
    }
    
    // Convert to expected Product interface
    const convertedFiltered = filtered.map(p => ({
      ...p,
      has_stock: typeof p.has_stock !== 'undefined' ? p.has_stock : true,
    })) as unknown as Product[];
    setFilteredProducts(convertedFiltered);
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isFullscreen && (
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
          <h1 className="text-2xl font-bold">Point of Sale</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="ml-auto"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 h-full">
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-4">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select
              className="border p-2 rounded"
              value={selectedCategory || ''}
              onChange={(e) => handleCategorySelect(e.target.value === '' ? null : e.target.value)}
            >
              <option value="">All Categories</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <ScrollArea className="rounded-md border h-[75vh] w-full">
            <div className="grid grid-cols-3 gap-4 p-4">
              {isLoadingProducts ? (
                <p>Loading products...</p>
              ) : productsError ? (
                <p>Error loading products: {productsError.message}</p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCardPOS
                    key={product.id}
                    product={product}
                  />
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="col-span-1">
          <p>Cart and Checkout</p>
        </div>
      </div>
    </div>
  );
};

export default POSSales;
