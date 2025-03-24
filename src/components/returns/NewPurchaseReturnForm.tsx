
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BarcodeIcon, Search, Trash2 } from "lucide-react";
import { mockProducts, Product } from "@/models/product";
import { mockSuppliers, Supplier } from "@/models/supplier";
import { mockPurchaseOrders } from "@/models/purchaseOrder";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import SecurityCheckDialog from "@/components/returns/SecurityCheckDialog";

interface NewPurchaseReturnFormProps {
  onSuccess: () => void;
}

interface PurchaseReturnItem {
  productId: string;
  product: Product;
  returnQuantity: number;
  reason: string;
  batchCode?: string;
  expiryDate?: string;
  refundMethod: string;
  notes?: string;
}

export function NewPurchaseReturnForm({ onSuccess }: NewPurchaseReturnFormProps) {
  const [tab, setTab] = useState("po");
  const [poId, setPoId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [returnItems, setReturnItems] = useState<PurchaseReturnItem[]>([]);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const { toast } = useToast();

  // For total calculations
  const totalAmount = returnItems.reduce((sum, item) => 
    sum + (item.product.price * item.returnQuantity), 0);
  
  const handleAddItem = (product: Product) => {
    if (returnItems.some(item => item.productId === product.id)) {
      toast({
        title: "Product already added",
        description: "This product is already in the return list.",
        variant: "destructive"
      });
      return;
    }
    
    setReturnItems([
      ...returnItems,
      {
        productId: product.id,
        product,
        returnQuantity: 1,
        reason: "defective",
        refundMethod: "cash",
        notes: ""
      }
    ]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...returnItems];
    (newItems[index] as any)[field] = value;
    setReturnItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setReturnItems(returnItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (asDraft: boolean = true) => {
    if (returnItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to process the return.",
        variant: "destructive"
      });
      return;
    }

    if (!supplierId) {
      toast({
        title: "Supplier required",
        description: "Please select a supplier for this return.",
        variant: "destructive"
      });
      return;
    }

    // If total amount is over $1000, require manager approval
    if (totalAmount > 1000 && !asDraft) {
      setSecurityDialogOpen(true);
      return;
    }

    processReturn(asDraft);
  };

  const processReturn = (asDraft: boolean) => {
    // Here you would normally send the data to your backend
    toast({
      title: asDraft ? "Return saved as draft" : "Return processed successfully",
      description: `The supplier return has been ${asDraft ? "saved as draft" : "processed"} with ${returnItems.length} items for a total of ${formatCurrency(totalAmount)}.`,
    });
    onSuccess();
  };

  // Filter products for search based on current supplier
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.barcode.includes(searchTerm);
    
    // If supplier is selected, only show products from that supplier
    if (selectedSupplier) {
      return matchesSearch && selectedSupplier.products.includes(product.id);
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="po">Find by Purchase Order</TabsTrigger>
          <TabsTrigger value="manual">Add Items Manually</TabsTrigger>
        </TabsList>
        
        <TabsContent value="po" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="po-search">Purchase Order Number</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="po-search"
                  placeholder="Enter PO number"
                  className="pl-8"
                  value={poId}
                  onChange={(e) => setPoId(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={supplierId} onValueChange={(value) => {
                setSupplierId(value);
                setSelectedSupplier(mockSuppliers.find(s => s.id === value) || null);
              }}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button variant="secondary" disabled={!poId.trim()} className="w-full">
            Lookup Purchase Order
          </Button>
          
          {selectedSupplier && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium">Supplier Information</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{selectedSupplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p>{selectedSupplier.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedSupplier.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{selectedSupplier.phone}</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="product-search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="product-search"
                  placeholder="Search by name or scan barcode"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="manual-supplier">Supplier</Label>
              <Select value={supplierId} onValueChange={(value) => {
                setSupplierId(value);
                setSelectedSupplier(mockSuppliers.find(s => s.id === value) || null);
              }}>
                <SelectTrigger id="manual-supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <BarcodeIcon className="h-4 w-4" />
              Scan Barcode
            </Button>
          </div>
          
          {searchTerm && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No products found matching "{searchTerm}"
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.slice(0, 5).map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">SKU: {product.barcode}</div>
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleAddItem(product)}>
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {returnItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Return Items</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Return Qty</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Batch/Expiry</TableHead>
                  <TableHead>Refund Method</TableHead>
                  <TableHead>Item Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnItems.map((item, index) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.product.price)} each
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        value={item.returnQuantity}
                        onChange={(e) => handleUpdateItem(index, "returnQuantity", parseInt(e.target.value) || 1)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.reason}
                        onValueChange={(value) => handleUpdateItem(index, "reason", value)}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defective">Defective</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="wrong_delivery">Wrong Delivery</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Input
                          placeholder="Batch Code"
                          className="w-full"
                          value={item.batchCode || ""}
                          onChange={(e) => handleUpdateItem(index, "batchCode", e.target.value)}
                        />
                        <Input
                          type="date"
                          placeholder="Expiry Date"
                          className="w-full"
                          value={item.expiryDate || ""}
                          onChange={(e) => handleUpdateItem(index, "expiryDate", e.target.value)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.refundMethod}
                        onValueChange={(value) => handleUpdateItem(index, "refundMethod", value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash Refund</SelectItem>
                          <SelectItem value="credit_note">Credit Note</SelectItem>
                          <SelectItem value="deduct_next_po">Deduct from Next PO</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.product.price * item.returnQuantity)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="return-notes">Additional Notes</Label>
            <Textarea
              id="return-notes"
              placeholder="Add any additional notes or information about this return"
              rows={3}
            />
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Total Return Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalAmount > 1000 ? "Manager approval required for returns over $1,000" : ""}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline">Cancel</Button>
              <div className="space-x-2">
                <Button variant="secondary" onClick={() => handleSubmit(true)}>
                  Save as Draft
                </Button>
                <Button onClick={() => handleSubmit(false)}>
                  Process Return
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <SecurityCheckDialog
        open={securityDialogOpen}
        onOpenChange={setSecurityDialogOpen}
        title="Manager Approval Required"
        description={`This return exceeds $1,000 (${formatCurrency(totalAmount)}). Please enter manager code to approve.`}
        onConfirm={() => {
          processReturn(false);
          setSecurityDialogOpen(false);
        }}
      />
    </div>
  );
}
