
import React, { useState } from "react";
import { Plus, FileText, Eye, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { mockSuppliers } from "@/models/supplier";
import SupplierFormModal from "@/components/inventory/SupplierFormModal";
import SupplierViewModal from "@/components/inventory/SupplierViewModal";
import SecurityCodeDialog from "@/components/inventory/SecurityCodeDialog";
import CreatePurchaseOrderModal from "@/components/inventory/CreatePurchaseOrderModal";

const Suppliers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [createPOOpen, setCreatePOOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleViewSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setViewOpen(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setEditOpen(true);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setDeleteId(supplierId);
    setSecurityOpen(true);
  };

  const handleCreatePO = (supplier: any) => {
    setSelectedSupplier(supplier);
    setCreatePOOpen(true);
  };

  // Filter suppliers based on search query
  const filteredSuppliers = mockSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Supplier
            </Button>
          </DialogTrigger>
          <SupplierFormModal />
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers by name, email or phone..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell className="text-center">{supplier.products.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewSupplier(supplier)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditSupplier(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCreatePO(supplier)}
                        >
                          Create PO
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => handleDeleteSupplier(supplier.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Modals */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <SupplierViewModal supplier={selectedSupplier} onClose={() => setViewOpen(false)} />
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <SupplierFormModal supplier={selectedSupplier} onClose={() => setEditOpen(false)} />
      </Dialog>

      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <SecurityCodeDialog 
          title="Delete Supplier" 
          description="Enter security code to delete this supplier"
          onConfirm={() => {
            console.log("Supplier deleted:", deleteId);
            setSecurityOpen(false);
          }}
          onCancel={() => setSecurityOpen(false)}
        />
      </Dialog>

      <Dialog open={createPOOpen} onOpenChange={setCreatePOOpen}>
        <CreatePurchaseOrderModal supplier={selectedSupplier} onClose={() => setCreatePOOpen(false)} />
      </Dialog>
    </div>
  );
};

export default Suppliers;
