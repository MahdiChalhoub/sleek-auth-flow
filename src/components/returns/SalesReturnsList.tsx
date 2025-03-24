
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, Trash2, Printer, FileText } from "lucide-react";
import { mockSalesReturns } from "@/models/returns";
import { formatCurrency } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import SecurityCheckDialog from "@/components/returns/SecurityCheckDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SalesReturnsListProps {
  dateRange: DateRange;
  clientId: string;
  searchQuery: string;
}

export function SalesReturnsList({ dateRange, clientId, searchQuery }: SalesReturnsListProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [returnToDelete, setReturnToDelete] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter sales returns based on date range, client, and search query
  const filteredReturns = mockSalesReturns.filter(returnItem => {
    // Filter by date range
    const returnDate = new Date(returnItem.date);
    const isInDateRange = 
      (!dateRange.from || returnDate >= dateRange.from) &&
      (!dateRange.to || returnDate <= dateRange.to);
    
    // Filter by client
    const isMatchingClient = !clientId || returnItem.clientId === clientId;
    
    // Filter by search query (match product names)
    const matchesSearch = !searchQuery || returnItem.items.some(item => 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return isInDateRange && isMatchingClient && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "approved":
        return <Badge variant="secondary">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "finalized":
        return <Badge variant="default">Finalized</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleView = (returnId: string) => {
    navigate(`/returns/sales/${returnId}`);
  };

  const handleApprove = (returnId: string) => {
    toast({
      title: "Return Approved",
      description: `Return #${returnId} has been approved.`,
    });
  };

  const handleDelete = (returnId: string) => {
    setReturnToDelete(returnId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (returnToDelete) {
      toast({
        title: "Return Deleted",
        description: `Return #${returnToDelete} has been deleted.`,
      });
      setReturnToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      No returns found matching the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>{returnItem.date}</TableCell>
                      <TableCell>{returnItem.invoiceId}</TableCell>
                      <TableCell>{returnItem.clientName}</TableCell>
                      <TableCell>
                        {returnItem.items.length === 1 
                          ? returnItem.items[0].productName
                          : `${returnItem.items.length} items`}
                      </TableCell>
                      <TableCell>{formatCurrency(returnItem.totalAmount)}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleView(returnItem.id)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {returnItem.status === "draft" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleApprove(returnItem.id)}
                                title="Approve Return"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive/90"
                                onClick={() => handleDelete(returnItem.id)}
                                title="Delete Return"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {returnItem.status === "finalized" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Print Receipt"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Export PDF"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <SecurityCheckDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Delete Return"
        description="Are you sure you want to delete this return? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </>
  );
}
