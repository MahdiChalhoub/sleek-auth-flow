
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Download, List, Check } from "lucide-react";

const ExportMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"pdf" | "csv">("pdf");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "name", "category", "barcode", "price", "stock"
  ]);

  const columns = [
    { id: "name", label: "Product Name" },
    { id: "category", label: "Category" },
    { id: "sku", label: "SKU" },
    { id: "barcode", label: "Barcode" },
    { id: "price", label: "Price" },
    { id: "cost", label: "Cost" },
    { id: "stock", label: "Quantity" },
    { id: "threshold", label: "Low Stock Threshold" },
    { id: "expiry", label: "Expiry Date" },
  ];

  const toggleColumn = (columnId: string) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(id => id !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };

  const handleExport = () => {
    console.log("Exporting data in", format, "format with columns:", selectedColumns);
    setOpen(false);
    // Show toast notification in real app
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <FileText size={16} />
        Export
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              Choose the export format and select which columns to include.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Export Format */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Format</h4>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`border rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-accent ${format === "pdf" ? "border-primary bg-accent" : ""}`}
                  onClick={() => setFormat("pdf")}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">PDF Document</span>
                </div>
                <div 
                  className={`border rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-accent ${format === "csv" ? "border-primary bg-accent" : ""}`}
                  onClick={() => setFormat("csv")}
                >
                  <List className="h-4 w-4" />
                  <span className="text-sm">CSV Spreadsheet</span>
                </div>
              </div>
            </div>

            {/* Column Selection */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select Columns</h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {columns.map(column => (
                  <div 
                    key={column.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded p-1"
                    onClick={() => toggleColumn(column.id)}
                  >
                    <div className={`h-4 w-4 border rounded-sm flex items-center justify-center ${selectedColumns.includes(column.id) ? "bg-primary border-primary" : "border-input"}`}>
                      {selectedColumns.includes(column.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{column.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Options */}
            {format === "pdf" && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">PDF Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded p-1">
                    <input type="checkbox" id="include-header" defaultChecked />
                    <label htmlFor="include-header" className="text-sm cursor-pointer">
                      Include Company Header
                    </label>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded p-1">
                    <input type="checkbox" id="include-footer" defaultChecked />
                    <label htmlFor="include-footer" className="text-sm cursor-pointer">
                      Include Page Numbers
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportMenu;
