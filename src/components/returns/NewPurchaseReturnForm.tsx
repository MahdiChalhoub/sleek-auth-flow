
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PurchaseReturnItem, RefundMethod, ReturnReason } from "@/models/returns";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { RefundMethodSelector } from "./RefundMethodSelector";
import { ReturnProductList, ReturnItemType } from "./ReturnProductList";
import { ScanBarcodeInput } from "./ScanBarcodeInput";
import { ReturnSummary } from "./ReturnSummary";
import SecurityCheckDialog from "./SecurityCheckDialog";
import { mockProducts } from "@/models/product";
import { mockPurchaseOrders } from "@/models/purchaseOrder";
import { mockSuppliers } from "@/models/supplier";

const formSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase Order ID is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  notes: z.string().optional(),
});

interface NewPurchaseReturnFormProps {
  onSuccess: () => void;
}

export function NewPurchaseReturnForm({ onSuccess }: NewPurchaseReturnFormProps) {
  const [returnItems, setReturnItems] = useState<ReturnItemType[]>([]);
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("cash");
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseOrderId: "",
      supplierId: "",
      notes: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (returnItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must add at least one product to the return",
      });
      return;
    }

    const totalAmount = returnItems.reduce((total, item) => total + item.subtotal, 0);

    // Check if return requires manager approval (e.g., over $500)
    if (totalAmount > 500) {
      setOpenSecurityDialog(true);
      return;
    }

    completeReturn(values);
  };

  const completeReturn = (values: z.infer<typeof formSchema>) => {
    // Here we would normally send this to the API
    console.log("Creating purchase return:", {
      ...values,
      items: returnItems,
      refundMethod,
      totalAmount: returnItems.reduce((total, item) => total + item.subtotal, 0),
    });

    toast({
      title: "Return Created",
      description: "The purchase return has been created successfully",
    });

    onSuccess();
  };

  const handleSecurity = () => {
    completeReturn(form.getValues());
    setOpenSecurityDialog(false);
  };

  const handleAddProduct = (item: ReturnItemType) => {
    // Check if the product is already in the list
    const existingIndex = returnItems.findIndex(
      (existing) => existing.productId === item.productId
    );

    if (existingIndex >= 0) {
      const newItems = [...returnItems];
      newItems[existingIndex].returnQuantity += item.returnQuantity;
      newItems[existingIndex].subtotal = 
        newItems[existingIndex].returnQuantity * 
        newItems[existingIndex].unitPrice;
      setReturnItems(newItems);
    } else {
      setReturnItems([...returnItems, item]);
    }
  };

  // Simulate loading products from a purchase order
  const loadPurchaseOrderProducts = (poId: string) => {
    // This would normally be an API call
    const purchaseOrder = mockPurchaseOrders.find(po => po.id === poId);
    
    if (purchaseOrder) {
      const poProducts = purchaseOrder.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        returnQuantity: 1,
        unitPrice: item.unitCost,
        subtotal: item.unitCost,
        reason: "defective" as ReturnReason,
        batchCode: item.batch || "",
        expiryDate: item.expirationDate || ""
      }));
      
      setReturnItems(poProducts);
      
      // Auto-select the supplier
      form.setValue("supplierId", purchaseOrder.supplier.id);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="purchaseOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order Reference</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      loadPurchaseOrderProducts(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purchase order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockPurchaseOrders.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Return Items</h3>
            
            <Card>
              <CardContent className="p-4">
                <ScanBarcodeInput 
                  onProductFound={handleAddProduct} 
                  type="purchase"
                />
              </CardContent>
            </Card>
            
            <ReturnProductList 
              items={returnItems} 
              onUpdate={setReturnItems} 
              type="purchase"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Refund Details</h3>
              
              <RefundMethodSelector
                value={refundMethod}
                onChange={(value) => setRefundMethod(value as RefundMethod)}
                type="purchase"
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this return..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <ReturnSummary 
              items={returnItems} 
              type="purchase" 
              refundMethod={refundMethod} 
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (returnItems.length === 0) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "You must add at least one product to the return",
                  });
                  return;
                }
                
                toast({
                  title: "Return Saved as Draft",
                  description: "The purchase return has been saved as a draft",
                });
                
                onSuccess();
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit">
              Return to Supplier
            </Button>
          </div>
        </form>
      </Form>

      <SecurityCheckDialog
        open={openSecurityDialog}
        onOpenChange={setOpenSecurityDialog}
        title="Manager Approval Required"
        description="This return exceeds the standard limit. Please enter manager code to approve."
        onConfirm={handleSecurity}
      />
    </div>
  );
}
