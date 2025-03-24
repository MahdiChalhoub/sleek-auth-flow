
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText, Download } from "lucide-react";

interface PurchaseOrderViewModalProps {
  purchaseOrder: any;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  received: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const PurchaseOrderViewModal: React.FC<PurchaseOrderViewModalProps> = ({ purchaseOrder, onClose }) => {
  if (!purchaseOrder) return null;

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <div className="flex justify-between items-start">
          <div>
            <DialogTitle>Purchase Order: {purchaseOrder.id}</DialogTitle>
            <DialogDescription>
              Created on {purchaseOrder.dateCreated} by {purchaseOrder.createdBy}
            </DialogDescription>
          </div>
          <Badge className={statusColors[purchaseOrder.status]}>
            {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
          </Badge>
        </div>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        {/* Order Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Supplier</p>
            <p className="text-base">{purchaseOrder.supplier.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Expected Delivery</p>
            <p className="text-base">{purchaseOrder.expectedDelivery}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Payment Terms</p>
            <p className="text-base">{purchaseOrder.paymentTerms || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-base">{purchaseOrder.lastUpdated || "N/A"}</p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <p className="text-sm font-medium mb-2">Order Items</p>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-center font-medium">Quantity</th>
                  <th className="h-10 px-4 text-right font-medium">Unit Cost</th>
                  <th className="h-10 px-4 text-right font-medium">Tax</th>
                  <th className="h-10 px-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 pl-4 font-medium">{item.productName}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">${item.unitCost.toFixed(2)}</td>
                    <td className="p-2 text-right">${item.tax?.toFixed(2) || "0.00"}</td>
                    <td className="p-2 pr-4 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50">
                <tr className="border-t">
                  <td colSpan={4} className="p-2 pl-4 text-right font-medium">Subtotal:</td>
                  <td className="p-2 pr-4 text-right">${purchaseOrder.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2 pl-4 text-right font-medium">Tax:</td>
                  <td className="p-2 pr-4 text-right">${purchaseOrder.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2 pl-4 text-right font-medium">Discount:</td>
                  <td className="p-2 pr-4 text-right">-${purchaseOrder.discount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="p-2 pl-4 text-right font-bold">Total:</td>
                  <td className="p-2 pr-4 text-right font-bold">${purchaseOrder.totalValue.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        {purchaseOrder.notes && (
          <div>
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm p-2 border rounded-md bg-muted/20">{purchaseOrder.notes}</p>
          </div>
        )}

        {/* Order History */}
        <div>
          <p className="text-sm font-medium mb-2">Order History</p>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">Date</th>
                  <th className="h-10 px-4 text-left font-medium">Action</th>
                  <th className="h-10 px-4 text-left font-medium">User</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 pl-4">{purchaseOrder.lastUpdated || purchaseOrder.dateCreated}</td>
                  <td className="p-2">Order {purchaseOrder.status}</td>
                  <td className="p-2">{purchaseOrder.updatedBy || purchaseOrder.createdBy}</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 pl-4">{purchaseOrder.dateCreated}</td>
                  <td className="p-2">Order created</td>
                  <td className="p-2">{purchaseOrder.createdBy}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DialogFooter>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default PurchaseOrderViewModal;
