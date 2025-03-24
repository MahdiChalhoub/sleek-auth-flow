
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const DailySummaryTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editNote, setEditNote] = useState("");
  
  // Mock data - in a real app, this would come from an API
  const summaryData = [
    {
      date: "2023-06-01",
      cashierName: "John Doe",
      registerStatus: "Closed",
      openingBalance: 500,
      closingBalance: 485,
      totalSales: 2547.85,
      returnCount: 3,
      discrepancy: -12.50,
      notes: "Minor cash discrepancy"
    },
    {
      date: "2023-06-02",
      cashierName: "Jane Smith",
      registerStatus: "Closed",
      openingBalance: 500,
      closingBalance: 500,
      totalSales: 3125.45,
      returnCount: 1,
      discrepancy: 0,
      notes: ""
    },
    {
      date: "2023-06-03",
      cashierName: "Robert Johnson",
      registerStatus: "Closed",
      openingBalance: 500,
      closingBalance: 505.25,
      totalSales: 1987.35,
      returnCount: 2,
      discrepancy: 5.25,
      notes: "Extra change found in drawer"
    },
    {
      date: "2023-06-04",
      cashierName: "Sarah Williams",
      registerStatus: "Closed",
      openingBalance: 500,
      closingBalance: 500,
      totalSales: 2845.75,
      returnCount: 0,
      discrepancy: 0,
      notes: ""
    },
    {
      date: "2023-06-05",
      cashierName: "John Doe",
      registerStatus: "Open",
      openingBalance: 500,
      closingBalance: null,
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
  
  const handleEditNote = (row: any) => {
    setSelectedRow(row);
    setEditNote(row.notes);
    setShowNoteDialog(true);
  };
  
  const handleSaveNote = () => {
    // In a real app, you would update the note in your API/database
    // Here we're just simulating that update
    console.log(`Saving note for ${selectedRow?.cashierName}: ${editNote}`);
    setShowNoteDialog(false);
  };
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(summaryData.length / itemsPerPage);
  const paginatedData = summaryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Register Status</TableHead>
              <TableHead className="text-right">Opening Balance</TableHead>
              <TableHead className="text-right">Closing Balance</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">Returns</TableHead>
              <TableHead className="text-right">Discrepancy</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>{row.cashierName}</TableCell>
                <TableCell>
                  <Badge variant={row.registerStatus === "Open" ? "outline" : "secondary"}>
                    {row.registerStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(row.openingBalance)}</TableCell>
                <TableCell className="text-right">
                  {row.closingBalance !== null ? formatCurrency(row.closingBalance) : "-"}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(row.totalSales)}</TableCell>
                <TableCell className="text-right">{row.returnCount}</TableCell>
                <TableCell className={`text-right ${row.discrepancy < 0 ? 'text-red-500' : row.discrepancy > 0 ? 'text-green-500' : ''}`}>
                  {row.discrepancy !== 0 ? formatCurrency(row.discrepancy) : '-'}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {row.notes || '-'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditNote(row)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Edit Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update notes for {selectedRow?.cashierName}'s session on {selectedRow && formatDate(selectedRow.date)}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input 
              value={editNote} 
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Enter session notes..."
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNoteDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
