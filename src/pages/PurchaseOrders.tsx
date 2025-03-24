
import React, { useState } from "react";
import { Plus, Eye, FileText, Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockPurchaseOrders } from "@/models/purchaseOrder";
import CreatePurchaseOrderModal from "@/components/inventory/CreatePurchaseOrderModal";
import PurchaseOrderViewModal from "@/components/inventory/PurchaseOrderViewModal";
import ReorderSuggestions from "@/components/inventory/ReorderSuggestions";
import ExportMenu from "@/components/inventory/ExportMenu";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  received: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const PurchaseOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleViewPO = (po: any) => {
    setSelectedPO(po);
    setViewOpen(true);
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
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <div className="flex gap-2">
          <ExportMenu />
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Create PO
              </Button>
            </DialogTrigger>
            <CreatePurchaseOrderModal onClose={() => setCreateOpen(false)} />
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suggestions">Reorder Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or supplier name..."
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
                    {filteredPOs.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.supplier.name}</TableCell>
                        <TableCell>{po.dateCreated}</TableCell>
                        <TableCell>{po.expectedDelivery}</TableCell>
                        <TableCell className="text-right">${po.totalValue.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[po.status]}>
                            {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewPO(po)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
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

        <TabsContent value="suggestions">
          <ReorderSuggestions />
        </TabsContent>
      </Tabs>

      {/* View PO Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <PurchaseOrderViewModal 
          purchaseOrder={selectedPO} 
          onClose={() => setViewOpen(false)} 
        />
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;
