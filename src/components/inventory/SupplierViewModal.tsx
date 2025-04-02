
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Package,
  DollarSign,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';

export interface SupplierViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: any;
}

const SupplierViewModal: React.FC<SupplierViewModalProps> = ({ isOpen, onClose, supplier }) => {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>Supplier Details</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold">{supplier.name}</h2>
              {supplier.contactPerson && (
                <p className="text-muted-foreground">Contact: {supplier.contactPerson}</p>
              )}
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {supplier.products?.length || 0} Products
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Supplier since: {new Date(supplier.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Contact Info</TabsTrigger>
              <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplier.phone && (
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{supplier.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {supplier.email && (
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{supplier.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {supplier.address && (
                  <Card className="md:col-span-2">
                    <CardContent className="p-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{supplier.address}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {supplier.notes && (
                  <Card className="md:col-span-2">
                    <CardContent className="p-4 flex items-start">
                      <FileText className="w-5 h-5 mr-2 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="whitespace-pre-line">{supplier.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="py-4">
                <p className="text-center text-muted-foreground">No purchase orders available</p>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="py-4">
                <p className="text-center text-muted-foreground">No products available</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierViewModal;
