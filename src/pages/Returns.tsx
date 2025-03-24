
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useScreenSize } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { SalesReturnsList } from "@/components/returns/SalesReturnsList";
import { PurchaseReturnsList } from "@/components/returns/PurchaseReturnsList";
import { NewSalesReturnButton } from "@/components/returns/NewSalesReturnButton";
import { NewPurchaseReturnButton } from "@/components/returns/NewPurchaseReturnButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const Returns: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [activeTab, setActiveTab] = useState<"sales" | "purchase">("sales");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [clientSupplier, setClientSupplier] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Returns & Exchanges</h1>
        <p className="text-muted-foreground">Process customer and supplier returns</p>
      </div>
      
      <Tabs defaultValue="sales" onValueChange={(value) => setActiveTab(value as "sales" | "purchase")}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-muted/60 backdrop-blur">
            <TabsTrigger value="sales">Sales Returns</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Returns</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {activeTab === "sales" ? (
              <NewSalesReturnButton />
            ) : (
              <NewPurchaseReturnButton />
            )}
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter Returns</CardTitle>
            <CardDescription>
              Narrow down results by date, {activeTab === "sales" ? "client" : "supplier"}, or product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Date Range</p>
                <DatePickerWithRange 
                  date={dateRange} 
                  setDate={setDateRange} 
                />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">
                  {activeTab === "sales" ? "Client" : "Supplier"}
                </p>
                <Select value={clientSupplier} onValueChange={setClientSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${activeTab === "sales" ? "client" : "supplier"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {activeTab === "sales" ? (
                      <>
                        <SelectItem value="client1">John Doe</SelectItem>
                        <SelectItem value="client2">Jane Smith</SelectItem>
                        <SelectItem value="client3">Bob Johnson</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="supplier1">Apple Inc.</SelectItem>
                        <SelectItem value="supplier2">Samsung Electronics</SelectItem>
                        <SelectItem value="supplier3">Sony Electronics</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Product Search</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <TabsContent value="sales" className="m-0">
            <SalesReturnsList 
              dateRange={dateRange} 
              clientId={clientSupplier} 
              searchQuery={searchQuery} 
            />
          </TabsContent>
          
          <TabsContent value="purchase" className="m-0">
            <PurchaseReturnsList 
              dateRange={dateRange} 
              supplierId={clientSupplier} 
              searchQuery={searchQuery} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Returns;
