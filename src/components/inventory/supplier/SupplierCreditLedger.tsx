
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}

interface LedgerEntry {
  id: string;
  date: string;
  poReference: string;
  amount: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: "paid" | "partial" | "overdue" | "pending";
  payments: Payment[];
}

interface AgingBucket {
  label: string;
  amount: number;
  percentage: number;
}

interface SupplierCreditLedgerProps {
  supplierId: string;
  supplierName: string;
}

const mockLedgerEntries: LedgerEntry[] = [
  {
    id: "L001",
    date: "2023-11-10",
    poReference: "PO-2023-001",
    amount: 14299.83,
    paid: 14299.83,
    balance: 0,
    dueDate: "2023-12-10",
    status: "paid",
    payments: [
      {
        id: "P001",
        date: "2023-12-05",
        amount: 14299.83,
        method: "Bank Transfer",
        reference: "TR-12345"
      }
    ]
  },
  {
    id: "L002",
    date: "2023-11-20",
    poReference: "PO-2023-002",
    amount: 11049.83,
    paid: 5000.00,
    balance: 6049.83,
    dueDate: "2023-12-20",
    status: "partial",
    payments: [
      {
        id: "P002",
        date: "2023-12-15",
        amount: 5000.00,
        method: "Bank Transfer",
        reference: "TR-12346"
      }
    ]
  },
  {
    id: "L003",
    date: "2023-12-01",
    poReference: "PO-2023-003",
    amount: 218.90,
    paid: 0,
    balance: 218.90,
    dueDate: "2023-12-15",
    status: "overdue",
    payments: []
  },
  {
    id: "L004",
    date: "2023-12-05",
    poReference: "PO-2023-004",
    amount: 2199.91,
    paid: 0,
    balance: 2199.91,
    dueDate: "2024-01-05",
    status: "pending",
    payments: []
  }
];

const SupplierCreditLedger: React.FC<SupplierCreditLedgerProps> = ({ supplierId, supplierName }) => {
  const [activeTab, setActiveTab] = useState("ledger");
  
  // Calculate the total outstanding balance
  const totalOutstanding = mockLedgerEntries.reduce((total, entry) => total + entry.balance, 0);
  
  // Calculate aging buckets
  const currentDate = new Date();
  const aging: AgingBucket[] = [
    { label: "0-30 days", amount: 0, percentage: 0 },
    { label: "31-60 days", amount: 0, percentage: 0 },
    { label: "61-90 days", amount: 0, percentage: 0 },
    { label: "90+ days", amount: 0, percentage: 0 }
  ];
  
  mockLedgerEntries.forEach(entry => {
    if (entry.balance <= 0) return;
    
    const dueDate = new Date(entry.dueDate);
    const daysDifference = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 30) {
      aging[0].amount += entry.balance;
    } else if (daysDifference <= 60) {
      aging[1].amount += entry.balance;
    } else if (daysDifference <= 90) {
      aging[2].amount += entry.balance;
    } else {
      aging[3].amount += entry.balance;
    }
  });
  
  // Calculate percentages
  aging.forEach(bucket => {
    bucket.percentage = totalOutstanding > 0 ? (bucket.amount / totalOutstanding) * 100 : 0;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Paid</Badge>;
      case "partial":
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">Partial</Badge>;
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Overdue</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="ledger">Ledger</TabsTrigger>
        <TabsTrigger value="aging">Aging Summary</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ledger">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">{supplierName} Credit Ledger</h3>
            <p className="text-sm text-muted-foreground">
              Total Outstanding: ${totalOutstanding.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Excel
            </Button>
            <Button size="sm">
              <DollarSign className="h-4 w-4 mr-1" />
              Add Payment
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLedgerEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>
                      <a href="#" className="text-blue-600 hover:underline">{entry.poReference}</a>
                    </TableCell>
                    <TableCell className="text-right">${entry.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${entry.paid.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${entry.balance.toFixed(2)}
                    </TableCell>
                    <TableCell>{entry.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="aging">
        <Card>
          <CardHeader>
            <CardTitle>Aging Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {aging.map((bucket, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">${bucket.amount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{bucket.label}</div>
                    <div className="text-xs text-muted-foreground">{bucket.percentage.toFixed(1)}% of total</div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${bucket.percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>PO Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLedgerEntries.flatMap(entry => 
                  entry.payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{entry.poReference}</TableCell>
                    </TableRow>
                  ))
                )}
                {mockLedgerEntries.flatMap(entry => entry.payments).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No payment history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SupplierCreditLedger;
