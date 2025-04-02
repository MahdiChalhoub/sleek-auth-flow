
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, User, FileText, Edit, Trash } from 'lucide-react';
import { renderCategory } from '@/utils/categoryRenderer';

export interface SupplierViewModalProps {
  supplier: any;
  onClose: () => void;
  isOpen: boolean;
}

const SupplierViewModal: React.FC<SupplierViewModalProps> = ({ supplier, onClose, isOpen }) => {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{supplier.name}</DialogTitle>
          <DialogDescription>
            Supplier details and order history
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supplier.contact_person && (
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Contact Person</p>
                        <p className="text-muted-foreground">{supplier.contact_person}</p>
                      </div>
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{supplier.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {supplier.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">{supplier.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{supplier.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {supplier.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <p className="text-muted-foreground">{supplier.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                    Product categories supplied by this vendor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {supplier.categories ? 
                      supplier.categories.map((category: any) => (
                        <Badge key={typeof category === 'string' ? category : category.id} variant="outline">
                          {renderCategory(category)}
                        </Badge>
                      ))
                      : 
                      <p className="text-muted-foreground">No categories assigned</p>
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Purchase order history will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Supplier activity history will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className="gap-1">
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierViewModal;
