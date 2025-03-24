
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Mail, FileDown, ShoppingBag, Check, Building, CalendarDays, CreditCard, Receipt } from "lucide-react";
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
  paymentMethods: Record<string, number>;
  amountPaid: number;
  change: number;
  client?: {
    name: string;
    phone?: string;
    email?: string;
    isVip?: boolean;
  };
  usedCredit?: boolean;
}

const InvoicePreview = ({
  isOpen,
  onClose,
  onNewSale,
  cartItems,
  subtotal,
  discount,
  total,
  paymentMethods,
  amountPaid,
  change,
  client,
  usedCredit
}: InvoicePreviewProps) => {
  const transactionCode = `TX-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date();
  const cashierName = "John Doe"; // In a real app, this would be the logged-in user's name
  
  // Function to trigger printing
  const handlePrint = () => {
    // In a real app, this would trigger the print dialog or send to a receipt printer
    window.print();
  };
  
  // Function to email the receipt
  const handleEmail = () => {
    // In a real app, this would trigger sending an email with receipt
    console.log("Emailing receipt to:", client?.email);
    window.open(`mailto:${client?.email || ''}?subject=Receipt ${transactionCode}&body=Please find your receipt attached.`);
  };
  
  // Function to save as PDF
  const handleSaveAsPDF = () => {
    // In a real app, this would trigger PDF generation and download
    console.log("Saving receipt as PDF");
  };
  
  // Function to get payment method display name
  const getPaymentMethodDisplay = (method: string) => {
    const paymentMethodMap: Record<string, string> = {
      cash: "Cash",
      card: "Credit/Debit Card",
      bank: "Bank Transfer",
      wave: "Wave",
      mobile: "Mobile Money",
      credit: "Customer Account"
    };
    
    return paymentMethodMap[method] || method;
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
              <div className="flex items-center justify-center gap-1 mb-1">
                <CalendarDays className="h-3 w-3" />
                <p className="text-xs text-muted-foreground">{format(currentDate, "PPpp")}</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Receipt className="h-3 w-3" />
                <p className="text-xs text-muted-foreground">Transaction: {transactionCode}</p>
              </div>
            </div>
            
            {/* Business Info */}
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-1">
                <Building className="h-3 w-3" />
                <p className="text-xs font-semibold">ACME CORPORATION</p>
              </div>
              <p className="text-xs text-muted-foreground">123 Business Ave, City, Country</p>
              <p className="text-xs text-muted-foreground">Tax ID: 123456789</p>
            </div>
            
            {/* Client Info */}
            {client && client.name !== "Guest" && (
              <div className="mb-3 text-xs">
                <p><span className="font-semibold">Customer:</span> {client.name} {client.isVip && "(VIP)"}</p>
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
              
              {/* Payment Methods */}
              {usedCredit ? (
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    <span>Charged to Account:</span>
                  </div>
                  <span>${total.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  {Object.entries(paymentMethods).map(([method, amount]) => 
                    amount > 0 ? (
                      <div key={method} className="flex justify-between">
                        <span>{getPaymentMethodDisplay(method)}:</span>
                        <span>${amount.toFixed(2)}</span>
                      </div>
                    ) : null
                  )}
                  
                  {change > 0 && (
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span>${change.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Separator className="my-3" />
            
            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground">
              <p>Cashier: {cashierName}</p>
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
            
            <Button variant="outline" size="sm" onClick={handleEmail} className="flex items-center gap-2" disabled={!client?.email}>
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
