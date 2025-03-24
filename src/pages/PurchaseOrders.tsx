
import React, { useState } from "react";
import { Plus, Eye, FileText, Download, Filter, Search, ScanLine, Clock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockPurchaseOrders } from "@/models/purchaseOrder";
import CreatePurchaseOrderModal from "@/components/inventory/CreatePurchaseOrderModal";
import PurchaseOrderViewModal from "@/components/inventory/PurchaseOrderViewModal";
import ReorderSuggestions from "@/components/inventory/ReorderSuggestions";
import ExportMenu from "@/components/inventory/ExportMenu";
import BarcodeScannerModal from "@/components/inventory/BarcodeScannerModal";
import { useToast } from "@/components/ui/use-toast";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  received: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  ordered: "bg-blue-100 text-blue-800" // Adding ordered status to match CreatePurchaseOrderModal
};

const PurchaseOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const { toast } = useToast();

  // Handle keyboard shortcut for barcode scanning
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'b') {
        event.preventDefault();
        setScannerOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewPO = (po: any) => {
    setSelectedPO(po);
    setViewOpen(true);
  };

  const handleBarcodeScanned = (barcode: string) => {
    toast({
      title: "Barcode Scanned",
      description: `Product with barcode ${barcode} will be added to the purchase order.`,
    });
    setScannerOpen(false);
    setCreateOpen(true);
  };

  // Filter POs based on search query and status
  const filteredPOs = mockPurchaseOrders.filter(po => {
    const matchesSearch = 
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || po.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter
  const statuses = ["all", ...Array.from(new Set(mockPurchaseOrders.map(po => po.status)))];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage your supplier orders and inventory restocking</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setScannerOpen(true)}
            className="relative bg-white/80 border-slate-200"
            title="Scan Barcode (Alt+B)"
          >
            <ScanLine size={18} />
            <kbd className="absolute bottom-0 right-0 bg-primary/10 text-[10px] rounded px-1">Alt+B</kbd>
          </Button>
          <ExportMenu />
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <Plus size={16} />
                Create PO
              </Button>
            </DialogTrigger>
            <CreatePurchaseOrderModal 
              onClose={() => setCreateOpen(false)} 
              onScan={() => setScannerOpen(true)}
            />
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <FileText size={16} />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            Reorder Suggestions
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock size={16} />
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or supplier name..."
                className="pl-8 bg-white/90 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center w-full md:w-1/3">
              <Filter size={16} className="text-muted-foreground" />
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white/90 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

          <Card className="bg-white/90 backdrop-blur-md border-slate-200/50 shadow-sm rounded-xl">
            <CardContent className="p-0">
              <div className="rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPOs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No purchase orders found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPOs.map((po) => (
                        <TableRow key={po.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium">{po.id}</TableCell>
                          <TableCell>{po.supplier.name}</TableCell>
                          <TableCell>{po.dateCreated}</TableCell>
                          <TableCell>{po.expectedDelivery}</TableCell>
                          <TableCell className="text-right font-mono">${po.totalValue.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={statusColors[po.status]}>
                              {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewPO(po)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
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

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredPOs.length} of {mockPurchaseOrders.length} purchase orders
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="bg-white/80">Previous</Button>
              <Button variant="outline" size="sm" disabled className="bg-white/80">Next</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <ReorderSuggestions />
        </TabsContent>

        <TabsContent value="recent">
          <Card className="bg-white/90 backdrop-blur-md border-slate-200/50 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Recent Purchase Order Activity</CardTitle>
              <CardDescription>View the latest changes to purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPurchaseOrders.slice(0, 3).map((po) => (
                  <div key={po.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-200/50 hover:bg-slate-50/50 transition-all">
                    <div className={`rounded-full p-2 ${po.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {po.status === 'completed' ? (
                        <FileText className="h-4 w-4 text-green-700" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{po.id}</h4>
                          <p className="text-sm text-muted-foreground">{po.supplier.name}</p>
                        </div>
                        <Badge className={statusColors[po.status]}>
                          {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm">
                        {po.status === 'completed' 
                          ? `Completed on ${po.lastUpdated || po.dateCreated}`
                          : `Expected delivery on ${po.expectedDelivery}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View PO Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <PurchaseOrderViewModal 
          purchaseOrder={selectedPO} 
          onClose={() => setViewOpen(false)} 
        />
      </Dialog>

      {/* Barcode Scanner Modal */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <BarcodeScannerModal onScan={handleBarcodeScanned} onClose={() => setScannerOpen(false)} />
      </Dialog>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={() => setCreateOpen(true)}
          size="lg" 
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default PurchaseOrders;
