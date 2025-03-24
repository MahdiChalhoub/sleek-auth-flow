
import React, { useState } from "react";
import { Plus, Eye, Edit, Trash2, FileText, Download, Printer, ArrowUpDown, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts } from "@/models/product";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProductViewModal from "@/components/inventory/ProductViewModal";
import ProductFormModal from "@/components/inventory/ProductFormModal";
import SecurityCodeDialog from "@/components/inventory/SecurityCodeDialog";
import StockAdjustmentTable from "@/components/inventory/StockAdjustmentTable";
import ModificationRequestList from "@/components/inventory/ModificationRequestList";
import BarcodeModal from "@/components/inventory/BarcodeModal";
import ExportMenu from "@/components/inventory/ExportMenu";

const Inventory: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

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

  // Filter products based on search query and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(mockProducts.map(p => p.category)))];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <ExportMenu />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Product
              </Button>
            </DialogTrigger>
            <ProductFormModal />
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, barcode or description..."
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
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="inventory" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="stockadjustment">Stock Adjustment</TabsTrigger>
          <TabsTrigger value="modifications">Modification Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const isLowStock = product.stock <= 10;
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.barcode}</TableCell>
                          <TableCell className="text-right">${(product.price * 0.7).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{product.stock}</TableCell>
                          <TableCell className="text-center">
                            {isLowStock && (
                              <Badge variant="destructive" className="mr-1">Low Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stockadjustment">
          <StockAdjustmentTable products={filteredProducts} />
        </TabsContent>

        <TabsContent value="modifications">
          <ModificationRequestList />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <ProductViewModal product={selectedProduct} onClose={() => setViewOpen(false)} />
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <ProductFormModal product={selectedProduct} onClose={() => setEditOpen(false)} />
      </Dialog>

      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <SecurityCodeDialog 
          title="Delete Product" 
          description="Enter security code to delete this product"
          onConfirm={() => {
            console.log("Product deleted:", deleteProductId);
            setSecurityOpen(false);
          }}
          onCancel={() => setSecurityOpen(false)}
        />
      </Dialog>

      <Dialog open={barcodeOpen} onOpenChange={setBarcodeOpen}>
        <BarcodeModal product={selectedProduct} onClose={() => setBarcodeOpen(false)} />
      </Dialog>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full w-12 h-12 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Inventory;
