
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText } from "lucide-react";

interface TransferViewModalProps {
  transfer: any;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  verified: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const TransferViewModal: React.FC<TransferViewModalProps> = ({ transfer, onClose }) => {
  if (!transfer) return null;

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <div className="flex justify-between items-start">
          <div>
            <DialogTitle>Transfer: {transfer.id}</DialogTitle>
            <DialogDescription>
              Created on {transfer.date} by {transfer.createdBy}
            </DialogDescription>
          </div>
          <Badge className={statusColors[transfer.status]}>
            {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
          </Badge>
        </div>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        {/* Transfer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Source Location</p>
            <p className="text-base">{transfer.source}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Destination</p>
            <p className="text-base">{transfer.destination}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Reason</p>
            <p className="text-base">{transfer.reason}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Transfer Date</p>
            <p className="text-base">{transfer.date}</p>
          </div>
        </div>

        {/* Transfer Items */}
        <div>
          <p className="text-sm font-medium mb-2">Transfer Items</p>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-center font-medium">Transfer Qty</th>
                  <th className="h-10 px-4 text-center font-medium">System Qty</th>
                  <th className="h-10 px-4 text-center font-medium">Difference</th>
                </tr>
              </thead>
              <tbody>
                {transfer.items.map((item: any, index: number) => {
                  const hasDifference = item.systemQuantity !== undefined && 
                                        item.difference !== undefined && 
                                        item.difference !== 0;
                  
                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2 pl-4 font-medium">{item.productName}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-center">{item.systemQuantity ?? "N/A"}</td>
                      <td className={`p-2 text-center font-medium ${
                        hasDifference 
                          ? item.difference > 0 
                            ? "text-green-600" 
                            : "text-red-600" 
                          : ""
                      }`}>
                        {item.difference !== undefined 
                          ? item.difference > 0 
                            ? `+${item.difference}` 
                            : item.difference 
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {transfer.notes && (
          <div>
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm p-2 border rounded-md bg-muted/20">{transfer.notes}</p>
          </div>
        )}

        {/* Verification Info */}
        {transfer.status === "verified" && transfer.verifiedBy && (
          <div className="p-4 border rounded-md bg-green-50">
            <p className="text-sm font-medium mb-1">Verification Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium">Verified By</p>
                <p>{transfer.verifiedBy}</p>
              </div>
              <div>
                <p className="font-medium">Verification Date</p>
                <p>{transfer.verifiedDate}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export
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

export default TransferViewModal;
