
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SecurityCodeDialog from "./SecurityCodeDialog";

interface StockAdjustmentTableProps {
  products: any[];
}

const StockAdjustmentTable: React.FC<StockAdjustmentTableProps> = ({ products }) => {
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);

  const handleCountChange = (productId: string, value: string) => {
    setCounts(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const calculateDifference = (productId: string, systemStock: number) => {
    const physicalCount = parseInt(counts[productId] || "0", 10);
    if (isNaN(physicalCount)) return null;
    return physicalCount - systemStock;
  };

  const handleAdjustStock = () => {
    setShowSecurityDialog(true);
  };

  const handleConfirmAdjustment = () => {
    // Here you would update the stock in your database
    console.log("Stock adjusted:", counts);
    setShowSecurityDialog(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 space-y-2">
          <h2 className="text-lg font-medium">Physical Inventory Count</h2>
          <p className="text-sm text-muted-foreground">
            Enter the actual quantity on hand for each product. The system will calculate the difference compared to the system quantity.
          </p>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">System Qty</TableHead>
                <TableHead className="text-right">Physical Count</TableHead>
                <TableHead className="text-right">Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const difference = calculateDifference(product.id, product.stock);
                const hasDiscrepancy = difference !== null && difference !== 0;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        value={counts[product.id] || ""}
                        onChange={(e) => handleCountChange(product.id, e.target.value)}
                        className="w-24 ml-auto"
                      />
                    </TableCell>
                    <TableCell 
                      className={`text-right font-medium ${
                        hasDiscrepancy 
                          ? difference! > 0 
                            ? "text-green-600" 
                            : "text-red-600" 
                          : ""
                      }`}
                    >
                      {difference !== null ? (
                        difference > 0 ? `+${difference}` : difference
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleAdjustStock}>
            Adjust Stock
          </Button>
        </div>

        <SecurityCodeDialog
          title="Confirm Stock Adjustment"
          description="Enter security code to confirm stock adjustment"
          onConfirm={handleConfirmAdjustment}
          onCancel={() => setShowSecurityDialog(false)}
        />
      </CardContent>
    </Card>
  );
};

export default StockAdjustmentTable;
