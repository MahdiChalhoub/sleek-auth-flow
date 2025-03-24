import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalesTrendsChart } from "@/components/dashboard/SalesTrendsChart";
import { TopSellingProductsChart } from "@/components/dashboard/TopSellingProductsChart";
import { ReturnsByCategoryChart } from "@/components/dashboard/ReturnsByCategoryChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { DailySummaryTable } from "@/components/dashboard/DailySummaryTable";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { CalendarIcon, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [cashier, setCashier] = useState<string>("");
  const [register, setRegister] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast.success(`Exporting data as ${format.toUpperCase()}`);
    // Implementation for actual export would go here
  };

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let greeting = "Good evening";
    
    if (hours < 12) {
      greeting = "Good morning";
    } else if (hours < 18) {
      greeting = "Good afternoon";
    }
    
    const roleSpecificMessage = {
      admin: "Here's an overview of your business performance.",
      manager: "Here's how your team is performing today.",
      cashier: "Here's your performance summary."
    };
    
    return `${greeting}, ${user?.name}! ${roleSpecificMessage[user?.role || "cashier"]}`;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{getWelcomeMessage()}</p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
        
        {/* Filter Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter dashboard data by date range, cashier, register, or products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Date Range</p>
                <DatePickerWithRange 
                  date={dateRange} 
                  setDate={setDateRange}
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Cashier</p>
                <Select value={cashier} onValueChange={setCashier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cashier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cashiers</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="robert">Robert Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Register</p>
                <Select value={register} onValueChange={setRegister}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select register" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Registers</SelectItem>
                    <SelectItem value="pos1">POS 1</SelectItem>
                    <SelectItem value="pos2">POS 2</SelectItem>
                    <SelectItem value="pos3">POS 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Product/Category</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products or categories..."
                    className="pl-8"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="m-0 space-y-6">
          <OverviewCards />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Last 6 months sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesTrendsChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <TopSellingProductsChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Returns by Category</CardTitle>
                <CardDescription>Distribution of returns across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ReturnsByCategoryChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Profit/Loss</CardTitle>
                <CardDescription>Financial performance by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfitLossChart />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
              <CardDescription>Register activity and sales summary</CardDescription>
            </CardHeader>
            <CardContent>
              <DailySummaryTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other Tabs - Simplified for this implementation */}
        <TabsContent value="sales" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sales Analysis</CardTitle>
              <CardDescription>In-depth sales metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              Detailed sales analysis will appear here.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Detailed product metrics and insights</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              Product performance data will appear here.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="returns" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Returns Analysis</CardTitle>
              <CardDescription>Patterns and insights from return data</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              Returns analysis data will appear here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
