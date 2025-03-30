
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Inbox, 
  Package, 
  ArrowUpDown, 
  FileText, 
  Filter, 
  Search, 
  Truck, 
  AlertTriangle,
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Send, 
  Plus,
  Calendar,
  User,
  ShoppingBag,
  Building,
  ScanBarcode
} from "lucide-react";
import { PurchaseRequest, mockPurchaseRequests, createPurchaseRequest } from "@/models/purchaseRequest";
import { assertType } from "@/utils/supabaseUtils";

const PurchaseRequests: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [showCreatePODialog, setShowCreatePODialog] = useState(false);
  const [showCreateTransferDialog, setShowCreateTransferDialog] = useState(false);
  const { toast } = useToast();

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...requests];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(req => 
        req.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    // Apply method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter(req => req.method === assertType<PurchaseRequest["method"]>(methodFilter));
    }
    
    // Apply supplier filter
    if (supplierFilter !== "all") {
      filtered = filtered.filter(req => 
        req.suggestedSupplierId === supplierFilter || 
        req.suppliers?.some(s => s.supplierId === supplierFilter)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter, methodFilter, supplierFilter]);

  // Toggle selection of a request
  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequests(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  // Select all visible requests
  const selectAllRequests = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(filteredRequests.map(req => req.id));
    } else {
      setSelectedRequests([]);
    }
  };

  // Create purchase order from selected requests
  const createPurchaseOrder = () => {
    if (selectedRequests.length === 0) {
      toast({
        title: "No requests selected",
        description: "Please select at least one request to create a purchase order.",
        variant: "destructive"
      });
      return;
    }
    
    // Group requests by supplier
    const requestsBySupplier: Record<string, PurchaseRequest[]> = {};
    
    selectedRequests.forEach(reqId => {
      const request = requests.find(r => r.id === reqId);
      if (request && request.suggestedSupplierId) {
        if (!requestsBySupplier[request.suggestedSupplierId]) {
          requestsBySupplier[request.suggestedSupplierId] = [];
        }
        requestsBySupplier[request.suggestedSupplierId].push(request);
      }
    });
    
    // In a real app, we would create POs for each supplier
    toast({
      title: "Purchase Orders Created",
      description: `Created ${Object.keys(requestsBySupplier).length} purchase orders for selected requests.`
    });
    
    // Update request status
    setRequests(prev => 
      prev.map(req => 
        selectedRequests.includes(req.id) 
          ? { ...req, status: "ordered" as const } 
          : req
      )
    );
    
    setSelectedRequests([]);
    setShowCreatePODialog(false);
  };

  // Create stock transfer from selected requests
  const createStockTransfer = () => {
    if (selectedRequests.length ===.0) {
      toast({
        title: "No requests selected",
        description: "Please select at least one request to create a stock transfer.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would create a stock transfer
    toast({
      title: "Stock Transfer Created",
      description: `Created stock transfer for ${selectedRequests.length} products.`
    });
    
    // Update request status and action type
    setRequests(prev => 
      prev.map(req => 
        selectedRequests.includes(req.id) 
          ? { ...req, status: "ordered" as const, actionType: "stock_transfer" as const } 
          : req
      )
    );
    
    setSelectedRequests([]);
    setShowCreateTransferDialog(false);
  };

  // Get badge color based on status
  const getStatusBadge = (status: PurchaseRequest["status"]) => {
    switch (status) {
      case "requested":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Requested</Badge>;
      case "ordered":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Ordered</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Delivered</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      case "reorder_after_fail":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Reordering</Badge>;
      case "success":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Success</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get icon for request method
  const getMethodIcon = (method: PurchaseRequest["method"]) => {
    switch (method) {
      case "scan":
        return <ScanBarcode className="h-4 w-4 text-blue-600" />;
      case "manual":
        return <FileText className="h-4 w-4 text-purple-600" />;
      case "ai_suggestion":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "sales_based":
        return <ShoppingBag className="h-4 w-4 text-green-600" />;
      case "expiry_alert":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "transfer_suggestion":
        return <Truck className="h-4 w-4 text-indigo-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Add a new manual request
  const addManualRequest = () => {
    const newRequest = createPurchaseRequest({
      productId: '10',
      productName: 'New Manual Request Product',
      barcode: 'MANUAL123',
      requestedQuantity: 5,
      method: 'manual',
      destinationLocation: 'Main Store',
      destinationLocationId: 'loc-1',
      status: 'requested',
      userName: 'Current User',
      notes: 'Manually requested by user',
    });
    
    setRequests(prev => [newRequest, ...prev]);
    
    toast({
      title: "Request Created",
      description: "New purchase request has been created successfully.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Requests Management</h1>
          <p className="text-muted-foreground">Manage purchase requests from all sources and create purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={addManualRequest}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Request
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-6 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Inbox size={16} />
            All
          </TabsTrigger>
          <TabsTrigger value="requested" className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Requested
          </TabsTrigger>
          <TabsTrigger value="ordered" className="flex items-center gap-2">
            <Package size={16} />
            Ordered
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex items-center gap-2">
            <Truck size={16} />
            Delivered
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <XCircle size={16} />
            Failed
          </TabsTrigger>
          <TabsTrigger value="success" className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Main Content */}
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or barcode..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Method Filter */}
              <div className="w-full md:w-[180px]">
                <Select
                  value={methodFilter}
                  onValueChange={setMethodFilter}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <SelectValue placeholder="Method" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="scan">Barcode Scan</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="ai_suggestion">AI Suggestion</SelectItem>
                    <SelectItem value="sales_based">Sales Based</SelectItem>
                    <SelectItem value="expiry_alert">Expiry Alert</SelectItem>
                    <SelectItem value="transfer_suggestion">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Status Filter */}
              <div className="w-full md:w-[180px]">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="reorder_after_fail">Reordering</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Supplier Filter */}
              <div className="w-full md:w-[180px]">
                <Select
                  value={supplierFilter}
                  onValueChange={setSupplierFilter}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <SelectValue placeholder="Supplier" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    <SelectItem value="SUP-001">Apple Inc.</SelectItem>
                    <SelectItem value="SUP-002">Samsung Electronics</SelectItem>
                    <SelectItem value="SUP-003">Electronics Wholesale</SelectItem>
                    <SelectItem value="SUP-004">Organic Farms Co.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Bulk Actions */}
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRequests([])}
                disabled={selectedRequests.length === 0}
              >
                Clear Selection ({selectedRequests.length})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreatePODialog(true)}
                disabled={selectedRequests.length === 0}
                className="flex items-center gap-1"
              >
                <Package className="h-4 w-4" />
                Create Purchase Order
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateTransferDialog(true)}
                disabled={selectedRequests.length === 0}
                className="flex items-center gap-1"
              >
                <Truck className="h-4 w-4" />
                Create Stock Transfer
              </Button>
            </div>
          </div>
          
          {/* Main Table */}
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          onCheckedChange={(checked) => selectAllRequests(!!checked)} 
                          checked={selectedRequests.length > 0 && selectedRequests.length === filteredRequests.length}
                        />
                      </TableHead>
                      <TableHead className="w-[200px]">Product</TableHead>
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center h-24">
                          No purchase requests found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id} className={selectedRequests.includes(request.id) ? "bg-slate-50" : ""}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedRequests.includes(request.id)} 
                              onCheckedChange={() => toggleRequestSelection(request.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              {request.productName}
                              {request.barcode && (
                                <div className="text-xs text-muted-foreground">{request.barcode}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{request.requestedQuantity}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getMethodIcon(request.method)}
                              <span className="text-xs">
                                {request.method.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {request.sourceLocation || "-"}
                          </TableCell>
                          <TableCell>
                            {request.destinationLocation || "-"}
                          </TableCell>
                          <TableCell>
                            {request.userName || "System"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(request.requestDate).toLocaleTimeString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Request Details",
                                    description: `Viewing details for: ${request.productName}`,
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              {request.status === "failed" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setRequests(prev => 
                                      prev.map(req => 
                                        req.id === request.id 
                                          ? { ...req, status: "reorder_after_fail" as const } 
                                          : req
                                      )
                                    );
                                  }}
                                >
                                  <RefreshCcw className="h-4 w-4" />
                                </Button>
                              )}
                              {request.status === "requested" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setRequests(prev => 
                                      prev.map(req => 
                                        req.id === request.id 
                                          ? { ...req, status: "ordered" as const } 
                                          : req
                                      )
                                    );
                                  }}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
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
        </TabsContent>
        
        {/* Status-specific tabs */}
        {["requested", "ordered", "delivered", "failed", "success"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="w-[200px]">Product</TableHead>
                        <TableHead>Requested Qty</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests
                        .filter(r => r.status === status)
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                {request.productName}
                                {request.barcode && (
                                  <div className="text-xs text-muted-foreground">{request.barcode}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{request.requestedQuantity}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getMethodIcon(request.method)}
                                <span className="text-xs">
                                  {request.method.replace('_', ' ')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {request.sourceLocation || "-"}
                            </TableCell>
                            <TableCell>
                              {request.destinationLocation || "-"}
                            </TableCell>
                            <TableCell>
                              {request.userName || "System"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(request.requestDate).toLocaleTimeString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Create Purchase Order Dialog */}
      <Dialog open={showCreatePODialog} onOpenChange={setShowCreatePODialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="mb-4">
              You are about to create purchase orders for {selectedRequests.length} items.
            </p>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Input
                  id="notes"
                  placeholder="Add notes for the supplier..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePODialog(false)}>
              Cancel
            </Button>
            <Button onClick={createPurchaseOrder}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Stock Transfer Dialog */}
      <Dialog open={showCreateTransferDialog} onOpenChange={setShowCreateTransferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Stock Transfer</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="mb-4">
              You are about to create a stock transfer for {selectedRequests.length} items.
            </p>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="source" className="text-sm font-medium">Source Location</label>
                <Select defaultValue="main">
                  <SelectTrigger>
                    <SelectValue placeholder="Select source location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="store1">Store Front</SelectItem>
                    <SelectItem value="store2">Downtown Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="destination" className="text-sm font-medium">Destination Location</label>
                <Select defaultValue="store1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="store1">Store Front</SelectItem>
                    <SelectItem value="store2">Downtown Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Input
                  id="notes"
                  placeholder="Add notes for the transfer..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTransferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createStockTransfer}>
              Create Stock Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseRequests;
