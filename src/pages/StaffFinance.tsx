
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Download, FileText, Search, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const StaffFinance: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("payroll");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [employeeFilter, setEmployeeFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast.success(`Exporting data as ${format.toUpperCase()}`);
    // Implementation for actual export would go here
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Finance</h1>
          <p className="text-muted-foreground">Manage payroll, expenses, and employee benefits</p>
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
            Process Payroll
          </Button>
        </div>
      </div>

      <Tabs defaultValue="payroll" onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="payroll" className="flex items-center">
            <DollarSign className="mr-1.5 h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center">
            <FileText className="mr-1.5 h-4 w-4" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center">
            <Briefcase className="mr-1.5 h-4 w-4" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center">
            <Users className="mr-1.5 h-4 w-4" />
            Staff
          </TabsTrigger>
        </TabsList>

        {/* Filter Card */}
        <Card className="my-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter staff finance data by date range, employee, or department
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
                <p className="text-sm font-medium mb-2">Employee</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search employee..."
                    className="pl-8"
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Department</p>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs Content */}
        <TabsContent value="payroll" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>Process and manage employee payroll</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Payroll Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the payroll management module. In a real application,
                  this would contain salary details, payment history, tax information, and payroll processing tools.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Management</CardTitle>
              <CardDescription>Track and approve employee expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Expenses Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the expense management module. In a real application,
                  this would contain expense reports, approval workflows, reimbursement tracking, and receipt management.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="benefits" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Management</CardTitle>
              <CardDescription>Manage employee benefits and compensation packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Benefits Module</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the benefits management module. In a real application,
                  this would contain health insurance details, retirement plans, paid time off tracking, and other employee benefits.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="m-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>View and manage employee information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Staff Directory</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a placeholder for the staff directory module. In a real application,
                  this would contain employee profiles, contact information, job titles, departments, and employment history.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffFinance;
