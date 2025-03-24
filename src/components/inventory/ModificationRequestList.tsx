
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

// Mock data for product modification requests
const mockRequests = [
  {
    id: "REQ-001",
    productId: "1",
    productName: "iPhone 15 Pro",
    requestType: "Price Change",
    originalValue: "$999.99",
    requestedValue: "$899.99",
    reason: "Competitive pricing adjustment",
    status: "pending",
    requestedBy: "Mike Manager",
    requestDate: "2023-12-05",
    reviewedBy: null,
    reviewDate: null
  },
  {
    id: "REQ-002",
    productId: "4",
    productName: "Samsung Galaxy S24",
    requestType: "Expiry Date Update",
    originalValue: "N/A",
    requestedValue: "2024-12-31",
    reason: "Updated manufacturer information",
    status: "approved",
    requestedBy: "Cathy Cashier",
    requestDate: "2023-12-01",
    reviewedBy: "John Admin",
    reviewDate: "2023-12-02"
  },
  {
    id: "REQ-003",
    productId: "6",
    productName: "Sony WH-1000XM5",
    requestType: "Barcode Update",
    originalValue: "100000006",
    requestedValue: "100000606",
    reason: "Incorrect barcode scanned",
    status: "rejected",
    requestedBy: "Mike Manager",
    requestDate: "2023-11-28",
    reviewedBy: "John Admin",
    reviewDate: "2023-11-29"
  }
];

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  approved: <Check className="h-4 w-4 text-green-500" />,
  rejected: <X className="h-4 w-4 text-red-500" />
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

const ModificationRequestList: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="mb-4 space-y-2">
        <h2 className="text-lg font-medium">Product Modification Requests</h2>
        <p className="text-sm text-muted-foreground">
          Review and approve/reject product modification requests from staff.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {mockRequests.map((request) => (
          <Card key={request.id} className="border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{request.productName}</CardTitle>
                  <CardDescription>{request.requestType}</CardDescription>
                </div>
                <Badge className={statusColors[request.status]}>
                  <span className="flex items-center gap-1">
                    {statusIcons[request.status]}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <p className="font-medium">Original Value</p>
                  <p>{request.originalValue}</p>
                </div>
                <div>
                  <p className="font-medium">Requested Value</p>
                  <p>{request.requestedValue}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Reason</p>
                  <p>{request.reason}</p>
                </div>
                <div>
                  <p className="font-medium">Requested By</p>
                  <p>{request.requestedBy}</p>
                </div>
                <div>
                  <p className="font-medium">Date</p>
                  <p>{request.requestDate}</p>
                </div>
                {request.reviewedBy && (
                  <>
                    <div>
                      <p className="font-medium">Reviewed By</p>
                      <p>{request.reviewedBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Review Date</p>
                      <p>{request.reviewDate}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            {request.status === "pending" && (
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm">
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModificationRequestList;
