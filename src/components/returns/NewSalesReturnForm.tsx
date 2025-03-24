
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ReturnReason, SalesReturnItem } from "@/models/returns";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { RefundMethodSelector } from "./RefundMethodSelector";
import { ReturnProductList, ReturnItemType } from "./ReturnProductList";
import { ScanBarcodeInput } from "./ScanBarcodeInput";
import { ReturnSummary } from "./ReturnSummary";
import SecurityCheckDialog from "./SecurityCheckDialog";
import { mockProducts } from "@/models/product";

const formSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  clientId: z.string().min(1, "Client is required"),
  notes: z.string().optional(),
});

interface NewSalesReturnFormProps {
  onSuccess: () => void;
}

export function NewSalesReturnForm({ onSuccess }: NewSalesReturnFormProps) {
  const [returnItems, setReturnItems] = useState<ReturnItemType[]>([]);
  const [refundMethod, setRefundMethod] = useState<"refund" | "credit" | "replace">("refund");
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceId: "",
      clientId: "",
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

    // Check if return requires manager approval (e.g., over $100)
    if (totalAmount > 100) {
      setOpenSecurityDialog(true);
      return;
    }

    completeReturn(values);
  };

  const completeReturn = (values: z.infer<typeof formSchema>) => {
    // Here we would normally send this to the API
    console.log("Creating sales return:", {
      ...values,
      items: returnItems,
      refundMethod,
      totalAmount: returnItems.reduce((total, item) => total + item.subtotal, 0),
    });

    toast({
      title: "Return Created",
      description: "The sales return has been created successfully",
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

  // Mock client list - in a real app, this would come from an API
  const clients = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
  ];

  // Mock invoices - in a real app, this would come from an API
  const invoices = [
    { id: "INV-2023-456", clientId: "1" },
    { id: "INV-2023-472", clientId: "3" },
    { id: "INV-2023-513", clientId: "2" },
  ];

  // Simulate loading products from an invoice
  const loadInvoiceProducts = (invoiceId: string) => {
    // This would normally be an API call
    const mockInvoiceProducts = mockProducts.slice(0, 3).map(product => ({
      productId: product.id,
      productName: product.name,
      originalQuantity: Math.floor(Math.random() * 5) + 1,
      returnQuantity: 1,
      unitPrice: product.price,
      subtotal: product.price,
      reason: "customer_unsatisfied" as ReturnReason,
      returnToStock: true
    }));
    
    setReturnItems(mockInvoiceProducts);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="invoiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Reference</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      loadInvoiceProducts(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select invoice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {invoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id}
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
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
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
                  type="sales"
                />
              </CardContent>
            </Card>
            
            <ReturnProductList 
              items={returnItems} 
              onUpdate={setReturnItems} 
              type="sales"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Refund Details</h3>
              
              <RefundMethodSelector
                value={refundMethod}
                onChange={(value) => setRefundMethod(value as "refund" | "credit" | "replace")}
                type="sales"
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
              type="sales" 
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
                  description: "The sales return has been saved as a draft",
                });
                
                onSuccess();
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit">
              Confirm Return
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
