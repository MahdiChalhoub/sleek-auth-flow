
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Branch } from "@/models/interfaces/businessInterfaces";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";
import { toast } from "sonner";

interface ModificationRequest {
  id: string;
  productId: string;
  productName: string;
  requestType: "price" | "stock" | "category" | "other";
  requestedBy: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected";
  oldValue: string;
  newValue: string;
  notes?: string;
}

// Mock data for demonstration
const mockModificationRequests: ModificationRequest[] = [
  {
    id: "req-1",
    productId: "1",
    productName: "iPhone 15 Pro",
    requestType: "price",
    requestedBy: "John Doe",
    requestedDate: "2023-12-01",
    status: "pending",
    oldValue: "$999",
    newValue: "$899",
    notes: "Holiday season discount"
  },
  {
    id: "req-2",
    productId: "3",
    productName: "AirPods Pro 2",
    requestType: "stock",
    requestedBy: "Jane Smith",
    requestedDate: "2023-12-02",
    status: "approved",
    oldValue: "15",
    newValue: "25",
    notes: "Received new shipment"
  }
];

interface ModificationRequestListProps {
  currentLocation?: Branch | null;
}

const ModificationRequestList: React.FC<ModificationRequestListProps> = ({ currentLocation }) => {
  // Filter requests based on location (in a real app)
  // For now, we'll just use the mock data

  const handleApprove = (requestId: string) => {
    toast.success(`Request ${requestId} approved successfully`);
  };

  const handleReject = (requestId: string) => {
    toast.error(`Request ${requestId} rejected`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modification Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {currentLocation ? (
          <div className="space-y-4">
            {mockModificationRequests.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Change</th>
                      <th className="p-2 text-left">Requested By</th>
                      <th className="p-2 text-center">Status</th>
                      <th className="p-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockModificationRequests.map((request) => (
                      <tr key={request.id} className="border-t">
                        <td className="p-2 font-medium">{request.productName}</td>
                        <td className="p-2 capitalize">{request.requestType}</td>
                        <td className="p-2">
                          <span className="text-muted-foreground line-through mr-2">{request.oldValue}</span>
                          <span className="font-medium">{request.newValue}</span>
                        </td>
                        <td className="p-2">{request.requestedBy}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </td>
                        <td className="p-2 text-right">
                          {request.status === "pending" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                size="sm"
                                variant="outline"
                                className="h-7 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleApprove(request.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="h-7 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleReject(request.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {request.status !== "pending" && (
                            <Button 
                              size="sm"
                              variant="outline"
                              className="h-7"
                            >
                              View Details
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No modification requests for {currentLocation.name}</p>
            )}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">Please select a location to view modification requests</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ModificationRequestList;
