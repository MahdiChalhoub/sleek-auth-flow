
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
import { CategorySalesDistributionChart } from "@/components/dashboard/CategorySalesDistributionChart";
import { MonthlyPurchaseVsSalesChart } from "@/components/dashboard/MonthlyPurchaseVsSalesChart";
import { DailySummaryTable } from "@/components/dashboard/DailySummaryTable";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { StaffManagementTable } from "@/components/dashboard/StaffManagementTable";
import { FinancialManagementSection } from "@/components/dashboard/FinancialManagementSection";
import { LoyaltyAndPromotionsSection } from "@/components/dashboard/LoyaltyAndPromotionsSection";
import { CalendarIcon, Download, FileText, Search, Users, BarChart3, DollarSign, ShoppingBag, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Get current date in nice format
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">{getWelcomeMessage()}</p>
            <Badge variant="outline" className="ml-2">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{getCurrentDate()}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="default">
            Quick Actions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="mr-1.5 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center">
              <Users className="mr-1.5 h-4 w-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center">
              <DollarSign className="mr-1.5 h-4 w-4" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center">
              <Gift className="mr-1.5 h-4 w-4" />
              Loyalty
            </TabsTrigger>
          </TabsList>
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
                <CardTitle>Sales & Profit Trends</CardTitle>
                <CardDescription>Last 6 months sales and profit performance</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesTrendsChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products by quantity and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <TopSellingProductsChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Sales Distribution</CardTitle>
                <CardDescription>Distribution of sales across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <CategorySalesDistributionChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Returns by Category</CardTitle>
                <CardDescription>Distribution of returns across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ReturnsByCategoryChart />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Purchases vs Sales</CardTitle>
              <CardDescription>Monthly comparison of purchases and sales</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyPurchaseVsSalesChart />
            </CardContent>
          </Card>
          
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
        
        {/* Staff Management Tab */}
        <TabsContent value="staff" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage employees, attendance, and payroll</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffManagementTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financial Management Tab */}
        <TabsContent value="finance" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Management</CardTitle>
              <CardDescription>Track financial performance and manage expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialManagementSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Loyalty & Promotions Tab */}
        <TabsContent value="loyalty" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty & Promotions</CardTitle>
              <CardDescription>Manage loyalty programs and promotional offers</CardDescription>
            </CardHeader>
            <CardContent>
              <LoyaltyAndPromotionsSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
