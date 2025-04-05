
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/providers/AuthProvider"; // Update to use the provider version
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Download, FileText, Search, Users, Tag, Award, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Loyalty: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("programs");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("");

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast.success(`Exporting data as ${format.toUpperCase()}`);
    // Implementation for actual export would go here
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Loyalty & Rewards</h1>
          <p className="text-muted-foreground">Manage loyalty programs, customer rewards, and promotions</p>
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
            Create Program
          </Button>
        </div>
      </div>

      <Tabs defaultValue="programs" onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="programs" className="flex items-center">
            <Gift className="mr-1.5 h-4 w-4" />
            Programs
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center">
            <Award className="mr-1.5 h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center">
            <Tag className="mr-1.5 h-4 w-4" />
            Promotions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="mr-1.5 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Filter Card */}
        <Card className="my-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter loyalty data by date range, customer, or program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Date Range</p>
                <DatePickerWithRange 
                  date={dateRange} 
                  setDate={setDateRange}
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Customer</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search customer..."
                    className="pl-8"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Program</p>
                <Select value={programFilter} onValueChange={setProgramFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="points">Points Program</SelectItem>
                    <SelectItem value="tier">Tier Program</SelectItem>
                    <SelectItem value="cashback">Cashback Program</SelectItem>
                    <SelectItem value="referral">Referral Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs Content */}
        <TabsContent value="programs" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Programs</CardTitle>
              <CardDescription>Manage and create customer loyalty programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Programs Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the loyalty programs module. In a real application,
                  this would contain program definitions, rules configuration, points systems, and tier management.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Rewards</CardTitle>
              <CardDescription>Manage customer rewards and redemptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Rewards Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the customer rewards module. In a real application,
                  this would contain reward catalogs, customer point balances, redemption history, and reward issuance tools.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>Create and manage promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Promotions Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the promotions module. In a real application,
                  this would contain promotional campaigns, discounts, coupons, and special offers management.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Analytics</CardTitle>
              <CardDescription>Analyze loyalty program performance and customer engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the loyalty analytics module. In a real application,
                  this would contain program performance metrics, customer engagement analytics, redemption trends, and ROI calculations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Loyalty;
