
import React, { useState, useEffect } from "react";
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
import { useLocationContext } from "@/contexts/LocationContext";
import { toast } from "sonner";
import { Location } from "@/types/location";

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
  const { currentLocation, availableLocations } = useLocationContext();

  // Filter transfers based on current location, search query and status
  const filteredTransfers = mockStockTransfers.filter(transfer => {
    // First filter by location - only show transfers where current location is source or destination
    if (currentLocation && 
        transfer.source !== currentLocation.name && 
        transfer.destination !== currentLocation.name) {
      return false;
    }

    const matchesSearch = 
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || transfer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setViewOpen(true);
  };

  const handleVerifyTransfer = (transfer: any) => {
    // Check if user has permission for the destination location
    const canVerify = !currentLocation || transfer.destination === currentLocation.name;
    
    if (!canVerify) {
      toast.error("You don't have permission to verify transfers for this destination");
      return;
    }
    
    setSelectedTransfer(transfer);
    setSecurityOpen(true);
  };

  // Get unique statuses for filter
  const statuses = ["all", ...Array.from(new Set(mockStockTransfers.map(t => t.status)))];
  
  // Redirect if no location is selected
  useEffect(() => {
    if (!currentLocation && availableLocations.length > 0) {
      toast.error("Please select a location to view stock transfers");
    }
  }, [currentLocation, availableLocations]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stock Transfers & Adjustments</h1>
          <p className="text-muted-foreground">
            {currentLocation ? `Managing transfers for ${currentLocation.name}` : "Please select a location"}
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" disabled={!currentLocation}>
              <Plus size={16} />
              New Transfer
            </Button>
          </DialogTrigger>
          <CreateTransferModal 
            onClose={() => setCreateOpen(false)} 
            currentLocation={currentLocation}
            availableLocations={availableLocations}
          />
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
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      {currentLocation ? 
                        "No transfers found for this location" : 
                        "Please select a location to view transfers"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => {
                    // Highlight the current location in the transfer
                    const isSource = currentLocation && transfer.source === currentLocation.name;
                    const isDestination = currentLocation && transfer.destination === currentLocation.name;
                    
                    return (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">{transfer.id}</TableCell>
                        <TableCell>{transfer.date}</TableCell>
                        <TableCell className={isSource ? "font-medium text-blue-700" : ""}>
                          {transfer.source}
                        </TableCell>
                        <TableCell className={isDestination ? "font-medium text-green-700" : ""}>
                          {transfer.destination}
                        </TableCell>
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
                            {transfer.status === "sent" && isDestination && (
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
                    );
                  })
                )}
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
          currentLocation={currentLocation}
        />
      </Dialog>

      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <SecurityCodeDialog 
          title="Verify Transfer" 
          description="Enter security code to verify this stock transfer"
          onConfirm={() => {
            console.log("Transfer verified:", selectedTransfer?.id);
            setSecurityOpen(false);
            toast.success(`Transfer ${selectedTransfer?.id} verified successfully`);
          }}
          onCancel={() => setSecurityOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default StockTransfers;
