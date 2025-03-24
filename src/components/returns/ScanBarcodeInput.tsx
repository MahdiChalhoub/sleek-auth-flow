
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Scan } from "lucide-react";
import { mockProducts } from "@/models/product";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReturnItemType } from "./ReturnProductList";

interface ScanBarcodeInputProps {
  onProductFound: (item: ReturnItemType) => void;
  type: "sales" | "purchase";
}

export function ScanBarcodeInput({ onProductFound, type }: ScanBarcodeInputProps) {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleScan = () => {
    if (!barcode.trim()) {
      setError("Please enter a barcode");
      return;
    }

    const product = mockProducts.find(p => p.barcode === barcode.trim());
    
    if (!product) {
      setError(`No product found with barcode: ${barcode}`);
      return;
    }

    onProductFound({
      productId: product.id,
      productName: product.name,
      originalQuantity: type === "sales" ? 1 : undefined,
      returnQuantity: 1,
      unitPrice: product.price,
      subtotal: product.price,
      reason: type === "sales" ? "customer_unsatisfied" : "damaged",
      returnToStock: type === "sales" ? true : undefined,
      batchCode: type === "purchase" ? "" : undefined,
      expiryDate: type === "purchase" ? "" : undefined
    });

    setBarcode("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Scan or enter barcode..."
            className="pl-8"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleScan();
              }
            }}
          />
        </div>
        <Button onClick={handleScan}>
          <Scan className="mr-2 h-4 w-4" />
          Scan
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
