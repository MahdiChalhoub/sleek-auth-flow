
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Tag, FileEdit, ShoppingCart } from "lucide-react";

// Define the props for the SupplierViewModal component
interface SupplierViewModalProps {
  supplier: {
    id: string;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    products?: any[]; // Product array, could be more specifically typed
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

// Create the SupplierViewModal component
const SupplierViewModal: React.FC<SupplierViewModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{supplier.name}</DialogTitle>
          <DialogDescription>
            Supplier details and purchase history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supplier.contactPerson && (
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Contact Person</Label>
                        <p>{supplier.contactPerson}</p>
                      </div>
                    </div>
                  )}

                  {supplier.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p>{supplier.email}</p>
                      </div>
                    </div>
                  )}

                  {supplier.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p>{supplier.phone}</p>
                      </div>
                    </div>
                  )}

                  {supplier.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p>{supplier.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{supplier.notes || "No notes available."}</p>
                </CardContent>
              </Card>
            </div>

            {supplier.products && supplier.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Products</CardTitle>
                  <CardDescription>Products supplied by {supplier.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {supplier.products.map((product) => (
                      <div key={typeof product === 'string' ? product : product.id} className="border rounded p-3">
                        <p className="font-medium">{typeof product === 'string' ? product : product.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              {onEdit && (
                <Button onClick={onEdit} variant="outline">
                  <FileEdit className="h-4 w-4 mr-2" />
                  Edit Supplier
                </Button>
              )}
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Purchase Orders</CardTitle>
                <CardDescription>
                  History of purchase orders from this supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No purchase orders found</h3>
                  <p className="text-muted-foreground mt-1">
                    You haven't made any purchases from this supplier yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierViewModal;
