
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SecurityCodeDialog from "./SecurityCodeDialog";
import { useScreenSize } from "@/hooks/use-mobile";

interface StockAdjustmentTableProps {
  products: any[];
}

const StockAdjustmentTable: React.FC<StockAdjustmentTableProps> = ({ products }) => {
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;

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

  // Responsive table content for mobile/tablet
  const renderMobileContent = () => {
    return (
      <div className="space-y-3">
        <Accordion type="single" collapsible className="w-full">
          {products.map((product) => {
            const difference = calculateDifference(product.id, product.stock);
            const hasDiscrepancy = difference !== null && difference !== 0;
            
            return (
              <AccordionItem key={product.id} value={product.id}>
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground text-sm">
                      Stock: {product.stock}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Category</p>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">System Quantity</p>
                      <p>{product.stock}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Physical Count</p>
                      <Input
                        type="number"
                        min="0"
                        value={counts[product.id] || ""}
                        onChange={(e) => handleCountChange(product.id, e.target.value)}
                        className="w-full"
                      />
                    </div>
                    {difference !== null && (
                      <div>
                        <p className="text-sm font-medium mb-1">Difference</p>
                        <p className={`font-medium ${
                          hasDiscrepancy 
                            ? difference > 0 
                              ? "text-green-600" 
                              : "text-red-600" 
                            : ""
                        }`}>
                          {difference !== null ? (
                            difference > 0 ? `+${difference}` : difference
                          ) : "-"}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  };

  // Desktop table content
  const renderDesktopContent = () => {
    return (
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
    );
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="mb-4 space-y-2">
          <h2 className="text-lg font-medium">Physical Inventory Count</h2>
          <p className="text-sm text-muted-foreground">
            Enter the actual quantity on hand for each product. The system will calculate the difference compared to the system quantity.
          </p>
        </div>

        {isSmallScreen ? renderMobileContent() : renderDesktopContent()}

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleAdjustStock}
            className={isSmallScreen ? "w-full" : ""}
          >
            Adjust Stock
          </Button>
        </div>

        <Dialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
          <SecurityCodeDialog
            title="Confirm Stock Adjustment"
            description="Enter security code to confirm stock adjustment"
            onConfirm={handleConfirmAdjustment}
            onCancel={() => setShowSecurityDialog(false)}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StockAdjustmentTable;
