import React, { useState, useEffect } from "react";
import { 
  Filter, Search, CalendarDays, Users, Tag, Package, MapPin, 
  ArrowDownUp, CheckSquare, CheckCircle, XCircle, RefreshCw,
  FileText, Truck, Check, X, Scan, Brain, PieChart, 
  Calendar, ClipboardList, UserCircle, BarChart, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  PurchaseRequest, 
  PurchaseRequestStatus, 
  PurchaseRequestMethod,
  mockPurchaseRequests 
} from "@/models/purchaseRequest";
import { mockSuppliers } from "@/models/supplier";
import { toast } from "sonner";

// Status colors and icons for visualization
const statusConfig: Record<PurchaseRequestStatus, {color: string, icon: React.ReactNode}> = {
  requested: { 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: <CheckSquare className="h-4 w-4" />
  },
  ordered: { 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: <FileText className="h-4 w-4" />
  },
  delivered: { 
    color: "bg-cyan-100 text-cyan-800 border-cyan-200", 
    icon: <Truck className="h-4 w-4" />
  },
  failed: { 
    color: "bg-red-100 text-red-800 border-red-200", 
    icon: <XCircle className="h-4 w-4" />
  },
  reorder_after_fail: { 
    color: "bg-purple-100 text-purple-800 border-purple-200", 
    icon: <RefreshCw className="h-4 w-4" />
  },
  success: { 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircle className="h-4 w-4" />
  }
};

// Method icons and labels
const methodConfig: Record<PurchaseRequestMethod, {icon: React.ReactNode, label: string}> = {
  scan: { 
    icon: <Scan className="h-4 w-4" />,
    label: "Barcode Scan"
  },
  manual: { 
    icon: <UserCircle className="h-4 w-4" />,
    label: "Manual Request"
  },
  ai_suggestion: { 
    icon: <Brain className="h-4 w-4" />,
    label: "AI Suggestion"
  },
  sales_based: { 
    icon: <BarChart className="h-4 w-4" />,
    label: "Sales-based"
  },
  expiry_alert: { 
    icon: <Calendar className="h-4 w-4" />,
    label: "Expiry Alert"
  },
  transfer_suggestion: { 
    icon: <Truck className="h-4 w-4" />,
    label: "Transfer Suggestion"
  }
};

const PurchaseRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // Effect to filter requests based on search, status, and method
  useEffect(() => {
    let filtered = requests;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.productName.toLowerCase().includes(query) ||
        req.barcode?.toLowerCase().includes(query) ||
        req.id.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }
    
    // Filter by method
    if (selectedMethod !== "all") {
      filtered = filtered.filter(req => req.method === selectedMethod);
    }
    
    // Filter by supplier
    if (selectedSupplier !== "all") {
      filtered = filtered.filter(req => 
        req.suggestedSupplierId === selectedSupplier ||
        req.suppliers?.some(s => s.supplierId === selectedSupplier)
      );
    }
    
    // Filter by tab
    if (selectedTab === "purchase_order") {
      filtered = filtered.filter(req => req.actionType === "purchase_order" || !req.actionType);
    } else if (selectedTab === "stock_transfer") {
      filtered = filtered.filter(req => req.actionType === "stock_transfer");
    } else if (selectedTab === "expired") {
      filtered = filtered.filter(req => req.method === "expiry_alert");
    }
    
    setFilteredRequests(filtered);
  }, [requests, searchQuery, selectedStatus, selectedMethod, selectedSupplier, selectedTab]);

  // Handle checkbox selection for bulk actions
  const handleCheckboxChange = (requestId: string) => {
    setSelectedRequests(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  // Select/Deselect all visible requests
  const handleSelectAllChange = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id));
    }
  };

  // Create Purchase Order from selected requests
  const handleCreatePurchaseOrder = () => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }
    
    toast.success(`Purchase order created for ${selectedRequests.length} items`);
    
    // Update request status to 'ordered'
    setRequests(prev => 
      prev.map(req => 
        selectedRequests.includes(req.id) 
          ? { ...req, status: 'ordered', purchaseOrderId: `PO-${Date.now()}`, lastUpdated: new Date().toISOString() } 
          : req
      )
    );
    
    setSelectedRequests([]);
  };

  // Create Stock Transfer from selected requests
  const handleCreateStockTransfer = () => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }
    
    toast.success(`Stock transfer created for ${selectedRequests.length} items`);
    
    // Update request status and action type
    setRequests(prev => 
      prev.map(req => 
        selectedRequests.includes(req.id) 
          ? { 
              ...req, 
              status: 'ordered', 
              actionType: 'stock_transfer',
              transferId: `TR-${Date.now()}`, 
              lastUpdated: new Date().toISOString() 
            } 
          : req
      )
    );
    
    setSelectedRequests([]);
  };

  // Cancel selected requests
  const handleCancelRequests = () => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }
    
    toast.success(`${selectedRequests.length} requests have been cancelled`);
    
    // Update request status to 'failed'
    setRequests(prev => 
      prev.map(req => 
        selectedRequests.includes(req.id) 
          ? { ...req, status: 'failed', lastUpdated: new Date().toISOString() } 
          : req
      )
    );
    
    setSelectedRequests([]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Request Management</h1>
          <p className="text-muted-foreground">Centralized hub to manage all product requests and orders</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white/90 border-slate-200"
            onClick={() => {
              const newRequest = { 
                ...mockPurchaseRequests[0],
                id: `req-${Date.now()}`,
                requestDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
              };
              setRequests(prev => [newRequest, ...prev]);
              toast.success("New test request added");
            }}
          >
            <Scan size={16} />
            Add Test Request
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <UserCircle size={16} />
            New Manual Request
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <ClipboardList size={16} />
            All Requests
          </TabsTrigger>
          <TabsTrigger value="purchase_order" className="flex items-center gap-2">
            <FileText size={16} />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="stock_transfer" className="flex items-center gap-2">
            <Truck size={16} />
            Stock Transfers
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-2">
            <Calendar size={16} />
            Expiry-Based
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or barcode..."
                className="pl-8 bg-white/90 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-muted-foreground" />
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full bg-white/90 border-slate-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="reorder_after_fail">Reordered</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Tag size={16} className="text-muted-foreground" />
                <Select 
                  value={selectedMethod} 
                  onValueChange={setSelectedMethod}
                >
                  <SelectTrigger className="w-full bg-white/90 border-slate-200">
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="scan">Barcode Scan</SelectItem>
                    <SelectItem value="manual">Manual Request</SelectItem>
                    <SelectItem value="ai_suggestion">AI Suggestion</SelectItem>
                    <SelectItem value="sales_based">Sales-based</SelectItem>
                    <SelectItem value="expiry_alert">Expiry Alert</SelectItem>
                    <SelectItem value="transfer_suggestion">Transfer Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Package size={16} className="text-muted-foreground" />
              <Select 
                value={selectedSupplier} 
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="w-full bg-white/90 border-slate-200">
                  <SelectValue placeholder="Filter by supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {mockSuppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <span className="font-medium">{selectedRequests.length} items selected</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCreatePurchaseOrder}
                    className="flex items-center gap-2 bg-white"
                  >
                    <FileText className="h-4 w-4" />
                    Create Purchase Order
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCreateStockTransfer}
                    className="flex items-center gap-2 bg-white"
                  >
                    <Truck className="h-4 w-4" />
                    Create Stock Transfer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelRequests}
                    className="flex items-center gap-2 bg-white text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requests Table */}
          <Card className="bg-white/90 backdrop-blur-md border-slate-200/50 shadow-sm rounded-xl">
            <CardContent className="p-0">
              <div className="rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <input 
                          type="checkbox" 
                          checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                          onChange={handleSelectAllChange}
                          className="rounded border-slate-300"
                        />
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No purchase requests found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell>
                            <input 
                              type="checkbox" 
                              checked={selectedRequests.includes(request.id)}
                              onChange={() => handleCheckboxChange(request.id)}
                              className="rounded border-slate-300"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{request.productName}</div>
                            {request.barcode && <div className="text-xs text-muted-foreground">Barcode: {request.barcode}</div>}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              {request.userName || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {methodConfig[request.method].icon}
                              <span className="text-sm">{methodConfig[request.method].label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{request.requestedQuantity}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(request.requestDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`px-2 py-1 ${statusConfig[request.status].color}`}>
                              <div className="flex items-center gap-1">
                                {statusConfig[request.status].icon}
                                <span>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace(/_/g, ' ')}
                                </span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              {request.destinationLocation || "Main Store"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {request.status === 'requested' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    // Update to ordered status
                                    setRequests(prev => 
                                      prev.map(req => 
                                        req.id === request.id 
                                          ? { ...req, status: 'ordered', purchaseOrderId: `PO-${Date.now()}` } 
                                          : req
                                      )
                                    );
                                    toast.success(`Request ${request.id} marked as ordered`);
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
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

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredRequests.length} of {requests.length} purchase requests
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="bg-white/80">Previous</Button>
              <Button variant="outline" size="sm" disabled className="bg-white/80">Next</Button>
            </div>
          </div>
        </TabsContent>

        {/* Other tabs content */}
        <TabsContent value="purchase_order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Requests</CardTitle>
              <CardDescription>Manage requests that require ordering from suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Purchase order specific content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock_transfer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Transfer Requests</CardTitle>
              <CardDescription>Manage requests for transferring stock between locations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Stock transfer specific content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiry-Based Requests</CardTitle>
              <CardDescription>Manage requests triggered by product expiration dates</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Expiry-related request content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseRequestManagement;
