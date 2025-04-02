import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import { Product } from '@/models/product';
import { ProductFormData } from '@/models/interfaces/productInterfaces';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/inventory/columns';
import { ProductFormModal } from '@/components/inventory/ProductFormModal';
import { categoriesService } from '@/services/categoryService';
import { Category } from '@/models/interfaces/categoryInterfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from 'sonner';
import { productsService } from '@/models/product';
import { Branch } from '@/types/location';
import { useLocation } from '@/hooks/useLocation';
import { renderCategory, getCategoryId, categoriesMatch } from '@/utils/categoryRenderer';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | { id: string; name: string } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLocation } = useLocation();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const productsData = await productsService.getAll();
        setProducts(productsData);
        
        const categoriesData = await categoriesService.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load inventory data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeCategory) {
      return matchesSearch && categoriesMatch(product.category, activeCategory);
    }
    
    return matchesSearch;
  });

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(product => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your products, stock levels, and categories
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Filter products by category</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2">
                  <div key="all" className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => setActiveCategory(undefined)}>
                    <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                    <span className="capitalize">All Products</span>
                  </div>
                  {categories.map(category => (
                    <div key={getCategoryId(category)} className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => setActiveCategory(category)}>
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="capitalize">{renderCategory(category)}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
              <CardDescription>View and manage your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-1">
                    No products match your search criteria.
                  </p>
                </div>
              ) : (
                <DataTable columns={columns} data={filteredProducts} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        currentLocation={currentLocation}
      />
    </div>
  );
};

export default Inventory;
