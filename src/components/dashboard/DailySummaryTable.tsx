
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const DailySummaryTable: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const summaryData = [
    {
      date: "2023-06-01",
      cashierName: "John Doe",
      registerStatus: "Closed",
      totalSales: 2547.85,
      returnCount: 3,
      discrepancy: -12.50,
      notes: "Minor cash discrepancy"
    },
    {
      date: "2023-06-02",
      cashierName: "Jane Smith",
      registerStatus: "Closed",
      totalSales: 3125.45,
      returnCount: 1,
      discrepancy: 0,
      notes: ""
    },
    {
      date: "2023-06-03",
      cashierName: "Robert Johnson",
      registerStatus: "Closed",
      totalSales: 1987.35,
      returnCount: 2,
      discrepancy: 5.25,
      notes: "Extra change found in drawer"
    },
    {
      date: "2023-06-04",
      cashierName: "Sarah Williams",
      registerStatus: "Closed",
      totalSales: 2845.75,
      returnCount: 0,
      discrepancy: 0,
      notes: ""
    },
    {
      date: "2023-06-05",
      cashierName: "John Doe",
      registerStatus: "Open",
      totalSales: 1756.50,
      returnCount: 1,
      discrepancy: 0,
      notes: "Current shift in progress"
    }
  ];
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead>Register Status</TableHead>
            <TableHead className="text-right">Total Sales</TableHead>
            <TableHead className="text-right">Returns</TableHead>
            <TableHead className="text-right">Discrepancy</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaryData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(row.date)}</TableCell>
              <TableCell>{row.cashierName}</TableCell>
              <TableCell>
                <Badge variant={row.registerStatus === "Open" ? "outline" : "secondary"}>
                  {row.registerStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(row.totalSales)}</TableCell>
              <TableCell className="text-right">{row.returnCount}</TableCell>
              <TableCell className={`text-right ${row.discrepancy < 0 ? 'text-red-500' : row.discrepancy > 0 ? 'text-green-500' : ''}`}>
                {row.discrepancy !== 0 ? formatCurrency(row.discrepancy) : '-'}
              </TableCell>
              <TableCell>{row.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
