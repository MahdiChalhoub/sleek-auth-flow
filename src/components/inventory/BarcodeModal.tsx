
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, Copy } from "lucide-react";

interface BarcodeModalProps {
  product: any;
  onClose: () => void;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const handlePrint = () => {
    console.log("Printing barcode for", product.name);
    window.print();
  };

  const handleDownload = () => {
    console.log("Downloading barcode for", product.name);
    // Implement barcode download logic
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(product.barcode);
    console.log("Barcode copied to clipboard:", product.barcode);
    // Show toast notification in real app
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Print Barcode</DialogTitle>
        <DialogDescription>Print or export barcode for {product.name}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Product Info */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-md overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">SKU-{product.id.padStart(6, '0')}</p>
          </div>
        </div>

        {/* Barcode Preview */}
        <div className="border rounded-lg p-4 print:border-none">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium">Barcode Preview</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleCopy}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          <div className="flex justify-center py-4 bg-white">
            {/* Barcode representation (in real app, use a proper barcode library) */}
            <div className="text-center">
              <div className="h-24 bg-[url('https://t3.ftcdn.net/jpg/00/58/33/12/360_F_58331212_HcxnQJjV1a9hfyK0uUOp7xpO6SQC23rS.jpg')] bg-contain bg-no-repeat bg-center w-64"></div>
              <p className="text-lg mt-2 font-mono">{product.barcode}</p>
            </div>
          </div>
        </div>

        {/* Price Tag Preview */}
        <div className="border rounded-lg p-4 print:border-none">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Price Tag Preview</p>
          </div>
          <div className="flex justify-center py-4 bg-white">
            <div className="text-center w-64 p-4 border border-dashed print:border-none">
              <p className="text-sm">{product.name}</p>
              <div className="h-12 bg-[url('https://t3.ftcdn.net/jpg/00/58/33/12/360_F_58331212_HcxnQJjV1a9hfyK0uUOp7xpO6SQC23rS.jpg')] bg-contain bg-no-repeat bg-center w-48 mx-auto mt-2 mb-1"></div>
              <p className="text-xs mb-2 font-mono">{product.barcode}</p>
              <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Print Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Print Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-accent">
              <input type="radio" id="single" name="printType" defaultChecked />
              <label htmlFor="single" className="text-sm cursor-pointer">
                Single Label
              </label>
            </div>
            <div className="border rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-accent">
              <input type="radio" id="multiple" name="printType" />
              <label htmlFor="multiple" className="text-sm cursor-pointer">
                Multiple Labels
              </label>
            </div>
          </div>

          <div className="border rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-accent">
            <input type="checkbox" id="withPrice" name="withPrice" defaultChecked />
            <label htmlFor="withPrice" className="text-sm cursor-pointer">
              Include Price Tag
            </label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default BarcodeModal;
