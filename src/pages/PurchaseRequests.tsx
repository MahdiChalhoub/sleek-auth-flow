
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Filter, Plus, Search, Tag, CheckSquare, FileText } from 'lucide-react';
import { PurchaseRequest, mockPurchaseRequests, PurchaseRequestStatus, PurchaseRequestMethod } from '@/models/purchaseRequest';
import { useLocationContext } from '@/contexts/LocationContext';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

const statusColors: Record<PurchaseRequestStatus, string> = {
  'requested': 'bg-yellow-100 text-yellow-800',
  'ordered': 'bg-blue-100 text-blue-800',
  'delivered': 'bg-cyan-100 text-cyan-800',
  'failed': 'bg-red-100 text-red-800',
  'reorder_after_fail': 'bg-purple-100 text-purple-800',
  'success': 'bg-green-100 text-green-800'
};

const methodLabels: Record<PurchaseRequestMethod, string> = {
  'scan': 'Barcode Scan',
  'manual': 'Manual Entry',
  'ai_suggestion': 'AI Suggestion',
  'sales_based': 'Sales Analysis',
  'expiry_alert': 'Expiry Alert',
  'transfer_suggestion': 'Transfer Option'
};

const methodIcons: Record<PurchaseRequestMethod, React.ReactNode> = {
  'scan': <Tag className="h-4 w-4 mr-1" />,
  'manual': <FileText className="h-4 w-4 mr-1" />,
  'ai_suggestion': <ChevronDown className="h-4 w-4 mr-1" />,
  'sales_based': <ChevronDown className="h-4 w-4 mr-1" />,
  'expiry_alert': <ChevronDown className="h-4 w-4 mr-1" />,
  'transfer_suggestion': <ChevronDown className="h-4 w-4 mr-1" />
};

interface FilterPanelProps {
  filters: {
    status: string;
    method: string;
    supplier: string;
    searchQuery: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const statuses = ['all', 'requested', 'ordered', 'delivered', 'failed', 'reorder_after_fail', 'success'];
  const methods = ['all', 'scan', 'manual', 'ai_suggestion', 'sales_based', 'expiry_alert', 'transfer_suggestion'];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statuses.filter(s => s !== 'all').map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filters.method}
            onChange={(e) => onFilterChange('method', e.target.value)}
          >
            <option value="all">All Methods</option>
            {methods.filter(m => m !== 'all').map(method => (
              <option key={method} value={method}>
                {methodLabels[method as PurchaseRequestMethod] || method}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={filters.supplier}
            onChange={(e) => onFilterChange('supplier', e.target.value)}
          >
            <option value="all">All Suppliers</option>
            <option value="apple">Apple Inc.</option>
            <option value="samsung">Samsung Electronics</option>
            <option value="organic">Organic Farms Co.</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const PurchaseRequests: React.FC = () => {
  const { currentLocation } = useLocationContext();
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    supplier: 'all',
    searchQuery: ''
  });
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId) 
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id));
    }
  };

  const handleCreatePurchaseOrder = () => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }
    
    toast.success(`Purchase order created for ${selectedRequests.length} items`);
    setIsActionDialogOpen(false);
    setSelectedRequests([]);
  };

  const handleCreateTransfer = () => {
    if (selectedRequests.length === 0) {
      toast.error("Please select at least one request");
      return;
    }
    
    toast.success(`Stock transfer created for ${selectedRequests.length} items`);
    setIsActionDialogOpen(false);
    setSelectedRequests([]);
  };

  // Filter requests based on current filters
  const filteredRequests = mockPurchaseRequests.filter(request => {
    const matchesSearch = 
      request.productName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (request.barcode && request.barcode.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
      (request.notes && request.notes.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || request.status === filters.status;
    const matchesMethod = filters.method === 'all' || request.method === filters.method;
    const matchesSupplier = filters.supplier === 'all' || 
      (request.suggestedSupplier && request.suggestedSupplier.toLowerCase().includes(filters.supplier.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesMethod && matchesSupplier;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Requests</h1>
          <p className="text-muted-foreground">
            Manage purchase requests from various sources
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
          
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="ordered">Ordered</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          
          <Card>
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Purchase Requests</CardTitle>
              
              {selectedRequests.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{selectedRequests.length} selected</span>
                  <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1">
                        <CheckSquare className="h-4 w-4" />
                        Actions
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Purchase Request Actions</DialogTitle>
                        <DialogDescription>
                          Select an action for the {selectedRequests.length} selected request(s).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Button onClick={handleCreatePurchaseOrder} className="w-full">
                          Create Purchase Order
                        </Button>
                        <Button onClick={handleCreateTransfer} variant="outline" className="w-full">
                          Create Stock Transfer
                        </Button>
                        <Button 
                          onClick={() => {
                            toast.success("Selected requests have been ignored");
                            setIsActionDialogOpen(false);
                            setSelectedRequests([]);
                          }} 
                          variant="ghost" 
                          className="w-full"
                        >
                          Ignore Requests
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300"
                            checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Suggested Supplier</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Request Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No purchase requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-gray-300"
                                checked={selectedRequests.includes(request.id)}
                                onChange={() => handleSelectRequest(request.id)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{request.productName}</div>
                            {request.barcode && (
                              <div className="text-xs text-muted-foreground">{request.barcode}</div>
                            )}
                          </TableCell>
                          <TableCell>{request.requestedQuantity}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                              {methodIcons[request.method]}
                              {methodLabels[request.method]}
                            </Badge>
                          </TableCell>
                          <TableCell>{request.suggestedSupplier || "Not specified"}</TableCell>
                          <TableCell>{request.destinationLocation || "Not specified"}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[request.status]}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p>Pending requests content...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ordered" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p>Ordered requests content...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p>Completed requests content...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseRequests;
