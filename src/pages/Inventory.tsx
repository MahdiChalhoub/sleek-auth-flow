import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, FileText, Download, Printer, ArrowUpDown, Filter, Search, Menu, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useProducts from "@/hooks/useProducts";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProductViewModal from "@/components/inventory/ProductViewModal";
import ProductFormModal from "@/components/inventory/ProductFormModal";
import SecurityCodeDialog from "@/components/inventory/SecurityCodeDialog";
import StockAdjustmentTable from "@/components/inventory/StockAdjustmentTable";
import ModificationRequestList from "@/components/inventory/ModificationRequestList";
import BarcodeModal from "@/components/inventory/BarcodeModal";
import ExportMenu from "@/components/inventory/ExportMenu";
import LocationStockFilter from "@/components/inventory/LocationStockFilter";
import { useLocationContext } from "@/contexts/LocationContext";
import { useScreenSize, useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Inventory: React.FC = () => {
  const { products: allProducts, isLoading: productsLoading, error: productsError } = useProducts();
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLocationId, setFilterLocationId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;
  const { currentLocation, availableLocations } = useLocationContext();

  useEffect(() => {
    if (currentLocation && !filterLocationId) {
      setFilterLocationId(currentLocation.id);
    }
  }, [currentLocation]);
  
  useEffect(() => {
    if (!currentLocation && availableLocations.length > 0) {
      toast.error("Please select a location to view inventory");
    }
  }, [currentLocation, availableLocations]);

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setDeleteProductId(productId);
    setSecurityOpen(true);
  };

  const handleBarcodeOpen = (product: any) => {
    setSelectedProduct(product);
    setBarcodeOpen(true);
  };

  const filteredProducts = allProducts.filter(product => {
    if (filterLocationId) {
      const locationStock = product.locationStock?.find(ls => ls.locationId === filterLocationId);
      if (!locationStock) return false;
    }

    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.barcode?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(allProducts.map(p => p.category || 'Uncategorized').filter(Boolean)))];

  const getLocationStock = (product: any) => {
    if (!filterLocationId) return product.stock;
    
    const locationStock = product.locationStock?.find(ls => ls.locationId === filterLocationId);
    return locationStock ? locationStock.stock : 0;
  };

  const isLowStock = (product: any) => {
    if (!filterLocationId) return product.stock <= 10;
    
    const locationStock = product.locationStock?.find(ls => ls.locationId === filterLocationId);
    if (!locationStock) return false;
    
    return locationStock.stock <= (locationStock.minStockLevel || 5);
  };

  const renderProductActions = (product: any) => {
    if (isSmallScreen) {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="flex flex-col gap-2 w-full">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleViewProduct(product)}>
                <Eye className="h-4 w-4 mr-2" /> View Details
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleEditProduct(product)}>
                <Edit className="h-4 w-4 mr-2" /> Edit Product
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleBarcodeOpen(product)}>
                <Printer className="h-4 w-4 mr-2" /> Print Barcode
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive/90"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Product
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleViewProduct(product)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleBarcodeOpen(product)}>
          <Printer className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive/90"
          onClick={() => handleDeleteProduct(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderProductTable = () => {
    if (isSmallScreen) {
      return (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const locationStock = getLocationStock(product);
            const lowStock = isLowStock(product);
            
            return (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      {lowStock && (
                        <Badge variant="destructive" className="mt-1">Low Stock</Badge>
                      )}
                    </div>
                    {renderProductActions(product)}
                  </div>
                  <div className="grid grid-cols-2 p-4 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Barcode</p>
                      <p>{product.barcode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p>${(product.cost || product.price * 0.7).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <div className="flex items-center gap-2">
                        <p className={lowStock ? "text-destructive font-medium" : ""}>
                          {locationStock}
                        </p>
                        {filterLocationId && (
                          <Badge variant="outline" className="text-[10px]">
                            {currentLocation && currentLocation.id === filterLocationId ? 
                              currentLocation.name : 
                              availableLocations.find(l => l.id === filterLocationId)?.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    return (
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>Quantity</span>
                  {filterLocationId && (
                    <Badge variant="outline" className="ml-1">
                      {availableLocations.find(l => l.id === filterLocationId)?.name.split(' ')[0]}
                    </Badge>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  {currentLocation ? 
                    "No products found for the selected filters" : 
                    "Please select a location to view inventory"}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const locationStock = getLocationStock(product);
                const lowStock = isLowStock(product);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell className="text-right">${(product.cost || product.price * 0.7).toFixed(2)}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{locationStock}</TableCell>
                    <TableCell className="text-center">
                      {lowStock && (
                        <Badge variant="destructive" className="mr-1">Low Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderProductActions(product)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Inventory Management</h1>
          {currentLocation && (
            <p className="text-muted-foreground">
              Managing inventory for {currentLocation.name}
            </p>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {isSmallScreen ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-2 pt-6">
                  <Button variant="default" className="w-full justify-start" asChild disabled={!currentLocation}>
                    <Dialog>
                      <DialogTrigger className="w-full text-left">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </DialogTrigger>
                      <ProductFormModal currentLocation={currentLocation} />
                    </Dialog>
                  </Button>
                  <ExportMenu fullWidth />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <>
              <ExportMenu />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" disabled={!currentLocation}>
                    <Plus size={16} />
                    Add Product
                  </Button>
                </DialogTrigger>
                <ProductFormModal currentLocation={currentLocation} />
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center w-full md:w-1/3">
          <Filter size={16} className="text-muted-foreground" />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <LocationStockFilter 
            onSelectLocation={setFilterLocationId}
            selectedLocationId={filterLocationId}
          />
        </div>
      </div>

      <Tabs defaultValue="inventory" onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="stockadjustment">Stock Adjustment</TabsTrigger>
          <TabsTrigger value="modifications">Modification Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardContent className="p-0 md:p-0">
              {renderProductTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stockadjustment">
          <StockAdjustmentTable 
            products={filteredProducts} 
            currentLocation={currentLocation}
          />
        </TabsContent>

        <TabsContent value="modifications">
          <ModificationRequestList currentLocation={currentLocation} />
        </TabsContent>
      </Tabs>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <ProductViewModal 
          product={selectedProduct} 
          onClose={() => setViewOpen(false)} 
          currentLocation={currentLocation}
        />
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <ProductFormModal 
          product={selectedProduct} 
          onClose={() => setEditOpen(false)} 
          currentLocation={currentLocation}
        />
      </Dialog>

      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <SecurityCodeDialog 
          title="Delete Product" 
          description="Enter security code to delete this product"
          onConfirm={() => {
            console.log("Product deleted:", deleteProductId);
            setSecurityOpen(false);
            toast.success("Product deleted successfully");
          }}
          onCancel={() => setSecurityOpen(false)}
        />
      </Dialog>

      <Dialog open={barcodeOpen} onOpenChange={setBarcodeOpen}>
        <BarcodeModal product={selectedProduct} onClose={() => setBarcodeOpen(false)} />
      </Dialog>

      {isSmallScreen && (
        <div className="fixed bottom-6 right-6 z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="rounded-full w-14 h-14 shadow-lg"
                disabled={!currentLocation}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <ProductFormModal currentLocation={currentLocation} />
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Inventory;
