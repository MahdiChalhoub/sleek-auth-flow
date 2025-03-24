
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  CircleDollarSign, 
  CreditCard, 
  FileText, 
  Plus, 
  Printer 
} from "lucide-react";

export const FinancialManagementSection: React.FC = () => {
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const financialData = {
    accountsReceivable: 12850.75,
    accountsPayable: 8450.35,
    totalRevenue: 124580.50,
    totalExpenses: 78920.25,
    recentTransactions: [
      {
        id: 1,
        date: "2023-06-25",
        description: "Sales - Store #1",
        type: "Income",
        amount: 2450.75,
        account: "Sales Revenue",
        reference: "INV-2023-125"
      },
      {
        id: 2,
        date: "2023-06-24",
        description: "Supplier Payment - Tech Distributors",
        type: "Expense",
        amount: 1850.25,
        account: "Inventory Purchases",
        reference: "PO-2023-089"
      },
      {
        id: 3,
        date: "2023-06-23",
        description: "Utility Bill - Electricity",
        type: "Expense",
        amount: 425.50,
        account: "Utilities",
        reference: "UTIL-2023-06"
      },
      {
        id: 4,
        date: "2023-06-22",
        description: "Sales - Online Store",
        type: "Income",
        amount: 1875.35,
        account: "Sales Revenue",
        reference: "INV-2023-124"
      },
      {
        id: 5,
        date: "2023-06-21",
        description: "Payroll - Staff Salaries",
        type: "Expense",
        amount: 5280.00,
        account: "Salaries & Wages",
        reference: "PAY-2023-12"
      }
    ],
    expenses: [
      {
        id: 1,
        date: "2023-06-24",
        category: "Inventory",
        description: "Supplier Payment - Tech Distributors",
        amount: 1850.25,
        paymentMethod: "Bank Transfer",
        status: "Paid"
      },
      {
        id: 2,
        date: "2023-06-23",
        category: "Utilities",
        description: "Utility Bill - Electricity",
        amount: 425.50,
        paymentMethod: "Credit Card",
        status: "Paid"
      },
      {
        id: 3,
        date: "2023-06-21",
        category: "Salaries",
        description: "Payroll - Staff Salaries",
        amount: 5280.00,
        paymentMethod: "Bank Transfer",
        status: "Paid"
      },
      {
        id: 4,
        date: "2023-06-18",
        category: "Rent",
        description: "Monthly Store Rent",
        amount: 2500.00,
        paymentMethod: "Bank Transfer",
        status: "Paid"
      },
      {
        id: 5,
        date: "2023-06-15",
        category: "Marketing",
        description: "Social Media Advertising",
        amount: 350.00,
        paymentMethod: "Credit Card",
        status: "Paid"
      },
      {
        id: 6,
        date: "2023-07-01",
        category: "Insurance",
        description: "Business Insurance Premium",
        amount: 750.00,
        paymentMethod: "Bank Transfer",
        status: "Pending"
      }
    ]
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
            <div className="rounded-full p-2 bg-blue-100 text-blue-700">
              <ArrowDownToLine className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.accountsReceivable)}</div>
            <p className="text-xs text-muted-foreground">Outstanding client balances</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Payable</CardTitle>
            <div className="rounded-full p-2 bg-amber-100 text-amber-700">
              <ArrowUpFromLine className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.accountsPayable)}</div>
            <p className="text-xs text-muted-foreground">Outstanding supplier balances</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="rounded-full p-2 bg-green-100 text-green-700">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Year-to-date revenue</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <div className="rounded-full p-2 bg-red-100 text-red-700">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Year-to-date expenses</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="journal" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="journal">Journal Entries</TabsTrigger>
            <TabsTrigger value="expenses">Expense Management</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>
          <div>
            <Button onClick={() => setShowAddExpenseDialog(true)} className="mr-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </div>
        </div>
        
        <TabsContent value="journal" className="space-y-4">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "Income" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell 
                      className={`text-right ${
                        transaction.type === "Income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{transaction.reference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>{expense.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={expense.status === "Paid" ? "outline" : "secondary"}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Balance Sheet</CardTitle>
                <CardDescription>Assets, liabilities and equity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Assets</span>
                  <span className="font-medium">{formatCurrency(financialData.accountsReceivable + 25000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Liabilities</span>
                  <span className="font-medium">{formatCurrency(financialData.accountsPayable)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Equity</span>
                  <span className="font-bold">{formatCurrency((financialData.accountsReceivable + 25000) - financialData.accountsPayable)}</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profit & Loss</CardTitle>
                <CardDescription>Revenue and expense summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-medium text-green-600">{formatCurrency(financialData.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="font-medium text-red-600">{formatCurrency(financialData.totalExpenses)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Net Profit</span>
                  <span className="font-bold">{formatCurrency(financialData.totalRevenue - financialData.totalExpenses)}</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cash Flow</CardTitle>
                <CardDescription>Cash movement summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cash Inflow</span>
                  <span className="font-medium text-green-600">{formatCurrency(financialData.totalRevenue * 0.85)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cash Outflow</span>
                  <span className="font-medium text-red-600">{formatCurrency(financialData.totalExpenses * 0.9)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Net Cash Flow</span>
                  <span className="font-bold">{formatCurrency((financialData.totalRevenue * 0.85) - (financialData.totalExpenses * 0.9))}</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Expense Dialog */}
      <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense for your business.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <Input placeholder="Enter expense description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Amount</p>
                <Input type="number" min="0.01" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Date</p>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Category</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Payment Method</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Reference / Receipt Number</p>
              <Input placeholder="Enter reference number (optional)..." />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddExpenseDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowAddExpenseDialog(false)}>
              Save Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
