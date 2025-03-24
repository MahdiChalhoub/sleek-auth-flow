
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from "@/models/product";
import { ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";

const ReorderSuggestions: React.FC = () => {
  // Mock data - in a real app this would come from your API
  const lowStockProducts = mockProducts
    .filter(product => product.stock <= 10)
    .sort((a, b) => a.stock - b.stock);

  const topSellingProducts = [
    { id: "1", name: "iPhone 15 Pro", category: "mobile", sold: 25, stock: 15 },
    { id: "4", name: "Samsung Galaxy S24", category: "mobile", sold: 18, stock: 20 },
    { id: "3", name: "AirPods Pro 2", category: "electronics", sold: 15, stock: 25 },
    { id: "6", name: "Sony WH-1000XM5", category: "electronics", sold: 10, stock: 12 },
    { id: "9", name: "Craft Beer Set", category: "beverages", sold: 9, stock: 15 }
  ];

  return (
    <Tabs defaultValue="low-stock">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="low-stock">Low Stock Alert</TabsTrigger>
        <TabsTrigger value="top-selling">Top Selling Products</TabsTrigger>
      </TabsList>

      <TabsContent value="low-stock" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Low Stock Products</CardTitle>
            </div>
            <CardDescription>
              These products are running low and should be reordered soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Product</th>
                    <th className="h-10 px-4 text-left font-medium">Category</th>
                    <th className="h-10 px-4 text-center font-medium">Current Stock</th>
                    <th className="h-10 px-4 text-center font-medium">Threshold</th>
                    <th className="h-10 px-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map(product => (
                    <tr key={product.id} className="border-t">
                      <td className="p-2 pl-4 font-medium">{product.name}</td>
                      <td className="p-2">{product.category}</td>
                      <td className={`p-2 text-center ${product.stock <= 5 ? "text-red-600 font-medium" : ""}`}>
                        {product.stock}
                      </td>
                      <td className="p-2 text-center">10</td>
                      <td className="p-2 pr-4 text-right">
                        <Button size="sm">Add to PO</Button>
                      </td>
                    </tr>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No products are currently below the stock threshold
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Create Purchase Order for All Low Stock Items
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="top-selling" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <CardTitle>Top Selling Products</CardTitle>
            </div>
            <CardDescription>
              These are your best selling products from the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Product</th>
                    <th className="h-10 px-4 text-left font-medium">Category</th>
                    <th className="h-10 px-4 text-center font-medium">Units Sold</th>
                    <th className="h-10 px-4 text-center font-medium">Current Stock</th>
                    <th className="h-10 px-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map(product => (
                    <tr key={product.id} className="border-t">
                      <td className="p-2 pl-4 font-medium">{product.name}</td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2 text-center font-medium">{product.sold}</td>
                      <td className={`p-2 text-center ${product.stock <= 10 ? "text-amber-600" : ""}`}>
                        {product.stock}
                      </td>
                      <td className="p-2 pr-4 text-right">
                        <Button size="sm">Add to PO</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Create Suggested Reorder Purchase Order
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ReorderSuggestions;
