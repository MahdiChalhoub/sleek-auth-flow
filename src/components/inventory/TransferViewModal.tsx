import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText, MapPin } from "lucide-react";
import { Location } from "@/types/location";

interface TransferViewModalProps {
  transfer: any;
  onClose: () => void;
  currentLocation: Location | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  verified: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const TransferViewModal: React.FC<TransferViewModalProps> = ({ 
  transfer, 
  onClose,
  currentLocation 
}) => {
  if (!transfer) return null;

  // Check if current location is source or destination
  const isSource = currentLocation && transfer.source === currentLocation.name;
  const isDestination = currentLocation && transfer.destination === currentLocation.name;

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
          <div className="flex items-start gap-2">
            <div className={`p-2 rounded-full ${isSource ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <MapPin className={`h-4 w-4 ${isSource ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Source Location</p>
              <p className={`text-base ${isSource ? 'font-medium text-blue-700' : ''}`}>
                {transfer.source}
                {isSource && <span className="ml-2 text-xs bg-blue-50 px-2 py-0.5 rounded">Current</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className={`p-2 rounded-full ${isDestination ? 'bg-green-100' : 'bg-gray-100'}`}>
              <MapPin className={`h-4 w-4 ${isDestination ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Destination</p>
              <p className={`text-base ${isDestination ? 'font-medium text-green-700' : ''}`}>
                {transfer.destination}
                {isDestination && <span className="ml-2 text-xs bg-green-50 px-2 py-0.5 rounded">Current</span>}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Reason</p>
            <p className="text-base">{transfer.reason}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Notes</p>
            <p className="text-base">{transfer.notes || "No notes provided"}</p>
          </div>
        </div>

        {/* Transfer Items */}
        <div>
          <h3 className="text-lg font-medium mb-3">Transfer Items</h3>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  {transfer.status === "verified" && (
                    <>
                      <th className="px-4 py-2 text-center">System Quantity</th>
                      <th className="px-4 py-2 text-center">Difference</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {transfer.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{item.productName}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    {transfer.status === "verified" && (
                      <>
                        <td className="px-4 py-3 text-center">{item.systemQuantity}</td>
                        <td className="px-4 py-3 text-center">
                          {typeof item.difference === 'number' && (
                            <span className={
                              item.difference < 0 ? "text-red-600" : 
                              item.difference > 0 ? "text-green-600" : ""
                            }>
                              {item.difference > 0 ? `+${item.difference}` : item.difference}
                            </span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Details */}
        {transfer.status === "verified" && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">Verification Details</h3>
            <p className="text-sm text-green-700">
              Verified by: {transfer.verifiedBy} on {transfer.verifiedDate}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Transfer
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export default TransferViewModal;
