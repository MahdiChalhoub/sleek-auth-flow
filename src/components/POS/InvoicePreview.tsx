
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Mail, FileDown, ShoppingBag, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface InvoicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSale: () => void;
  cartItems: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    discount: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  client?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

const InvoicePreview = ({
  isOpen,
  onClose,
  onNewSale,
  cartItems,
  subtotal,
  discount,
  total,
  paymentMethod,
  amountPaid,
  change,
  client
}: InvoicePreviewProps) => {
  const transactionCode = `TX-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date();
  
  // Function to trigger printing
  const handlePrint = () => {
    // In a real app, this would trigger the print dialog or send to a receipt printer
    window.print();
  };
  
  // Function to email the receipt
  const handleEmail = () => {
    // In a real app, this would trigger sending an email with receipt
    console.log("Emailing receipt to:", client?.email);
  };
  
  // Function to save as PDF
  const handleSaveAsPDF = () => {
    // In a real app, this would trigger PDF generation and download
    console.log("Saving receipt as PDF");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card overflow-hidden">
        <DialogHeader>
          <DialogTitle>Sale Complete</DialogTitle>
        </DialogHeader>
        
        {/* Receipt Content */}
        <div className="py-2">
          <div className="max-h-[70vh] overflow-y-auto p-4 bg-white rounded-md print:p-0 print:max-h-none">
            {/* Receipt Header */}
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">SALES RECEIPT</h3>
              <p className="text-xs text-muted-foreground">{format(currentDate, "PPpp")}</p>
              <p className="text-xs text-muted-foreground">Transaction: {transactionCode}</p>
            </div>
            
            {/* Client Info */}
            {client && client.name !== "Guest" && (
              <div className="mb-3 text-xs">
                <p><span className="font-semibold">Customer:</span> {client.name}</p>
                {client.phone && <p><span className="font-semibold">Phone:</span> {client.phone}</p>}
                {client.email && <p><span className="font-semibold">Email:</span> {client.email}</p>}
              </div>
            )}
            
            <Separator className="my-2" />
            
            {/* Items Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Price</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  const itemDiscount = itemTotal * (item.discount / 100);
                  const finalItemTotal = itemTotal - itemDiscount;
                  
                  return (
                    <tr key={item.product.id} className="border-b border-dashed">
                      <td className="py-1 text-left">{item.product.name}</td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">${item.product.price.toFixed(2)}</td>
                      <td className="py-1 text-right">${finalItemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Totals */}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Payment ({paymentMethod}):</span>
                <span>${amountPaid.toFixed(2)}</span>
              </div>
              
              {change > 0 && (
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>${change.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <Separator className="my-3" />
            
            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground">
              <p>Cashier: John Doe</p>
              <p className="mt-2">Thank you for your purchase!</p>
              <p>Please keep this receipt for returns or exchanges.</p>
              <p>Returns accepted within 30 days with receipt.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 w-full">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleEmail} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleSaveAsPDF} className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span>Save PDF</span>
            </Button>
            
            <Button onClick={onNewSale} className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>New Sale</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreview;
