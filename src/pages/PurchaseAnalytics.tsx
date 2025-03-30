
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bar, Line, Pie } from "recharts";
import { BarChart, LineChart, PieChart } from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import { DateRange } from "react-day-picker";
import {
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Truck,
  Package,
  Building,
  ShoppingBag
} from "lucide-react";

const mockSupplierPurchaseData = [
  { name: 'Apple Inc.', value: 24500, color: '#8884d8' },
  { name: 'Samsung Electronics', value: 18200, color: '#82ca9d' },
  { name: 'Electronics Wholesale', value: 12800, color: '#ffc658' },
  { name: 'Organic Farms Co.', value: 9700, color: '#ff8042' },
  { name: 'Tech Distributors', value: 14300, color: '#0088fe' }
];

const mockMonthlyPurchaseData = [
  { name: 'Jan', amount: 12000, returns: 800 },
  { name: 'Feb', amount: 19000, returns: 1200 },
  { name: 'Mar', amount: 17000, returns: 900 },
  { name: 'Apr', amount: 21000, returns: 1500 },
  { name: 'May', amount: 24000, returns: 1300 },
  { name: 'Jun', amount: 18000, returns: 1100 },
  { name: 'Jul', amount: 22000, returns: 1400 },
  { name: 'Aug', amount: 26000, returns: 1600 },
  { name: 'Sep', amount: 23000, returns: 1200 },
  { name: 'Oct', amount: 29000, returns: 1700 },
  { name: 'Nov', amount: 32000, returns: 1900 },
  { name: 'Dec', amount: 38000, returns: 2200 }
];

const mockCategoryPurchaseData = [
  { name: 'Electronics', value: 45000, color: '#8884d8' },
  { name: 'Food & Beverages', value: 28000, color: '#82ca9d' },
  { name: 'Clothing', value: 19000, color: '#ffc658' },
  { name: 'Home Goods', value: 17000, color: '#ff8042' },
  { name: 'Office Supplies', value: 12000, color: '#0088fe' }
];

const mockTopPurchasedItems = [
  { name: 'iPhone 15 Pro', supplier: 'Apple Inc.', quantity: 120, amount: 95880 },
  { name: 'Samsung Galaxy S24', supplier: 'Samsung Electronics', quantity: 80, amount: 55920 },
  { name: 'Sony WH-1000XM5', supplier: 'Electronics Wholesale', quantity: 60, amount: 21000 },
  { name: 'Organic Avocado', supplier: 'Organic Farms Co.', quantity: 500, amount: 995 },
  { name: 'MacBook Pro M3', supplier: 'Apple Inc.', quantity: 40, amount: 87960 }
];

const mockDeliveryPerformanceData = [
  { name: 'Apple Inc.', onTime: 95, delayed: 5 },
  { name: 'Samsung Electronics', onTime: 88, delayed: 12 },
  { name: 'Electronics Wholesale', onTime: 75, delayed: 25 },
  { name: 'Organic Farms Co.', onTime: 92, delayed: 8 },
  { name: 'Tech Distributors', onTime: 82, delayed: 18 }
];

const PurchaseAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1), // Jan 1st of current year
    to: new Date()
  });
  
  const [periodFilter, setPeriodFilter] = useState("year");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Calculate summary metrics
  const totalPurchases = mockMonthlyPurchaseData.reduce((sum, item) => sum + item.amount, 0);
  const totalReturns = mockMonthlyPurchaseData.reduce((sum, item) => sum + item.returns, 0);
  const returnRate = ((totalReturns / totalPurchases) * 100).toFixed(1);
  const averageDeliveryOnTime = mockDeliveryPerformanceData.reduce((sum, item) => sum + item.onTime, 0) / mockDeliveryPerformanceData.length;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Analytics</h1>
          <p className="text-muted-foreground">Analyze purchase trends, supplier performance, and inventory metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">Time Period</label>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">Supplier</label>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              <SelectItem value="apple">Apple Inc.</SelectItem>
              <SelectItem value="samsung">Samsung Electronics</SelectItem>
              <SelectItem value="electronics">Electronics Wholesale</SelectItem>
              <SelectItem value="organic">Organic Farms Co.</SelectItem>
              <SelectItem value="tech">Tech Distributors</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="food">Food & Beverages</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="home">Home Goods</SelectItem>
              <SelectItem value="office">Office Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Purchases</p>
                <h3 className="text-2xl font-bold">${(totalPurchases / 1000).toFixed(1)}K</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">+12.5%</span>
              <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Return Rate</p>
                <h3 className="text-2xl font-bold">{returnRate}%</h3>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">-2.1%</span>
              <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">On-Time Delivery</p>
                <h3 className="text-2xl font-bold">{averageDeliveryOnTime.toFixed(1)}%</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">+3.2%</span>
              <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Lead Time</p>
                <h3 className="text-2xl font-bold">4.8 days</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500 font-medium">-0.5 days</span>
              <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs with Charts */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Building size={16} />
            Suppliers
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package size={16} />
            Products
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp size={16} />
            Performance
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Purchase Trends</CardTitle>
                <CardDescription>Purchase volume and returns by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockMonthlyPurchaseData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" name="Purchase Amount" fill="#8884d8" />
                      <Bar dataKey="returns" name="Returns" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Purchase by Category</CardTitle>
                <CardDescription>Distribution of purchases across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockCategoryPurchaseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockCategoryPurchaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase by Supplier</CardTitle>
                <CardDescription>Distribution of purchases across top suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockSupplierPurchaseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockSupplierPurchaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Supplier Delivery Performance</CardTitle>
                <CardDescription>On-time vs. delayed deliveries by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockDeliveryPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" name="On Time %" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="delayed" name="Delayed %" stackId="a" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Purchased Products</CardTitle>
              <CardDescription>Products with highest purchase volume in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Supplier</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Quantity</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTopPurchasedItems.map((item, index) => (
                      <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{item.name}</td>
                        <td className="p-4 align-middle">{item.supplier}</td>
                        <td className="p-4 align-middle">{item.quantity}</td>
                        <td className="p-4 align-middle text-right">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Order Lifecycle</CardTitle>
                <CardDescription>Average time spent in each stage of the purchase process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Creation', days: 0.5 },
                        { name: 'Approval', days: 1.2 },
                        { name: 'Ordering', days: 0.8 },
                        { name: 'Delivery', days: 3.5 },
                        { name: 'Receiving', days: 0.9 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="days" name="Average Days" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
                <CardDescription>Purchase costs vs. budget over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', actual: 12000, budget: 15000 },
                        { month: 'Feb', actual: 19000, budget: 18000 },
                        { month: 'Mar', actual: 17000, budget: 18000 },
                        { month: 'Apr', actual: 21000, budget: 20000 },
                        { month: 'May', actual: 24000, budget: 22000 },
                        { month: 'Jun', actual: 18000, budget: 20000 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="budget" name="Budget" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="actual" name="Actual Cost" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseAnalytics;
