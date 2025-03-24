
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Printer, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Calendar,
  User
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShiftReportEntry {
  id: string;
  shiftDate: string;
  cashier: string;
  openingBalance: number;
  closingBalance: number;
  salesTotal: number;
  discounts: number;
  returns: number;
  discrepancy: number;
  status: "approved" | "pending" | "rejected";
  notes?: string;
}

const mockShiftReports: ShiftReportEntry[] = [
  {
    id: "SR-2023-001",
    shiftDate: "2023-12-20 08:00-16:00",
    cashier: "John Doe",
    openingBalance: 200,
    closingBalance: 1100,
    salesTotal: 1500,
    discounts: 50,
    returns: 75,
    discrepancy: 25,
    status: "approved",
    notes: "Holiday season rush with high traffic"
  },
  {
    id: "SR-2023-002",
    shiftDate: "2023-12-19 16:00-00:00",
    cashier: "Jane Smith",
    openingBalance: 200,
    closingBalance: 850,
    salesTotal: 700,
    discounts: 30,
    returns: 20,
    discrepancy: 0,
    status: "approved"
  },
  {
    id: "SR-2023-003",
    shiftDate: "2023-12-19 08:00-16:00",
    cashier: "John Doe",
    openingBalance: 200,
    closingBalance: 950,
    salesTotal: 800,
    discounts: 40,
    returns: 15,
    discrepancy: -5,
    status: "approved"
  },
  {
    id: "SR-2023-004",
    shiftDate: "2023-12-18 16:00-00:00",
    cashier: "Emily Johnson",
    openingBalance: 200,
    closingBalance: 1200,
    salesTotal: 1100,
    discounts: 60,
    returns: 40,
    discrepancy: 0,
    status: "approved"
  },
  {
    id: "SR-2023-005",
    shiftDate: "2023-12-18 08:00-16:00",
    cashier: "Jane Smith",
    openingBalance: 200,
    closingBalance: 750,
    salesTotal: 600,
    discounts: 25,
    returns: 30,
    discrepancy: 5,
    status: "approved"
  },
  {
    id: "SR-2023-006",
    shiftDate: "2023-12-21 08:00-16:00",
    cashier: "Emily Johnson",
    openingBalance: 200,
    closingBalance: 0,
    salesTotal: 0,
    discounts: 0,
    returns: 0,
    discrepancy: 0,
    status: "pending",
    notes: "Shift in progress"
  }
];

const ShiftReportsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ShiftReportEntry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [managerCode, setManagerCode] = useState("");
  
  const filteredReports = mockShiftReports.filter(
    report => 
      report.cashier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.shiftDate.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewReport = (report: ShiftReportEntry) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };
  
  const handleApproveReport = (report: ShiftReportEntry) => {
    setSelectedReport(report);
    
    // Check if discrepancy is above threshold (for demonstration, using $20)
    if (Math.abs(report.discrepancy) > 20) {
      setIsApproveModalOpen(true);
    } else {
      // Auto-approve if below threshold
      approveReport();
    }
  };
  
  const approveReport = () => {
    // In a real app, this would make an API call
    toast({
      title: "Report Approved",
      description: `Shift report ${selectedReport?.id} has been approved`,
    });
    setIsApproveModalOpen(false);
    setManagerCode("");
  };
  
  const toggleExpand = (reportId: string) => {
    if (expandedReport === reportId) {
      setExpandedReport(null);
    } else {
      setExpandedReport(reportId);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by cashier, date or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Filter by Cashier
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Shift Reports / Z-Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Report ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Discrepancy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <React.Fragment key={report.id}>
                  <TableRow>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleExpand(report.id)}
                      >
                        {expandedReport === report.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.shiftDate}</TableCell>
                    <TableCell>{report.cashier}</TableCell>
                    <TableCell className="text-right">${report.salesTotal.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={
                        report.discrepancy > 0 
                          ? "text-red-600" 
                          : report.discrepancy < 0 
                            ? "text-amber-600" 
                            : ""
                      }>
                        ${report.discrepancy.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewReport(report)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        {report.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleApproveReport(report)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedReport === report.id && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-4 bg-muted/50">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm font-medium">Opening Balance</div>
                            <div>${report.openingBalance.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Closing Balance</div>
                            <div>${report.closingBalance.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Discounts</div>
                            <div>${report.discounts.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Returns</div>
                            <div>${report.returns.toFixed(2)}</div>
                          </div>
                        </div>
                        {report.notes && (
                          <div className="mt-4">
                            <div className="text-sm font-medium">Notes</div>
                            <div className="text-sm mt-1">{report.notes}</div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No shift reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Report Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Shift Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedReport.id}</h3>
                  <p className="text-muted-foreground">{selectedReport.shiftDate}</p>
                </div>
                <div>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Cashier</h4>
                  <p>{selectedReport.cashier}</p>
                </div>
                <div>
                  <h4 className="font-medium">Total Sales</h4>
                  <p>${selectedReport.salesTotal.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Opening Balance</h4>
                  <p>${selectedReport.openingBalance.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Closing Balance</h4>
                  <p>${selectedReport.closingBalance.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Discounts</h4>
                  <p>${selectedReport.discounts.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Returns</h4>
                  <p>${selectedReport.returns.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Discrepancy</h4>
                  <p className={
                    selectedReport.discrepancy > 0 
                      ? "text-red-600" 
                      : selectedReport.discrepancy < 0 
                        ? "text-amber-600" 
                        : ""
                  }>
                    ${selectedReport.discrepancy.toFixed(2)}
                  </p>
                </div>
                {selectedReport.notes && (
                  <div className="col-span-2">
                    <h4 className="font-medium">Notes</h4>
                    <p>{selectedReport.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {selectedReport?.status === "pending" && (
                <Button onClick={() => {
                  setIsViewModalOpen(false);
                  handleApproveReport(selectedReport);
                }}>
                  Approve
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manager Approval Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Manager Approval Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              This shift report has a discrepancy of ${selectedReport?.discrepancy.toFixed(2)}, which is above the threshold. Manager approval is required.
            </p>
            <Input
              type="password"
              placeholder="Enter manager code"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={approveReport} disabled={!managerCode}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftReportsList;
