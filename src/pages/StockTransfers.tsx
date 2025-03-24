
import React, { useState } from "react";
import { Plus, Eye, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { mockStockTransfers } from "@/models/stockTransfer";
import CreateTransferModal from "@/components/inventory/CreateTransferModal";
import TransferViewModal from "@/components/inventory/TransferViewModal";
import SecurityCodeDialog from "@/components/inventory/SecurityCodeDialog";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  verified: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const StockTransfers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  const handleViewTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setViewOpen(true);
  };

  const handleVerifyTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setSecurityOpen(true);
  };

  // Filter transfers based on search query and status
  const filteredTransfers = mockStockTransfers.filter(transfer => {
    const matchesSearch = 
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || transfer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter
  const statuses = ["all", ...Array.from(new Set(mockStockTransfers.map(t => t.status)))];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Transfers & Adjustments</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Transfer
            </Button>
          </DialogTrigger>
          <CreateTransferModal onClose={() => setCreateOpen(false)} />
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transfers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center w-full md:w-1/3">
          <Filter size={16} className="text-muted-foreground" />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.id}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>{transfer.source}</TableCell>
                    <TableCell>{transfer.destination}</TableCell>
                    <TableCell>{transfer.reason}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={statusColors[transfer.status]}>
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewTransfer(transfer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transfer.status === "sent" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerifyTransfer(transfer)}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <TransferViewModal 
          transfer={selectedTransfer} 
          onClose={() => setViewOpen(false)} 
        />
      </Dialog>

      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <SecurityCodeDialog 
          title="Verify Transfer" 
          description="Enter security code to verify this stock transfer"
          onConfirm={() => {
            console.log("Transfer verified:", selectedTransfer?.id);
            setSecurityOpen(false);
          }}
          onCancel={() => setSecurityOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default StockTransfers;
