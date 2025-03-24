
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReturnReason } from "@/models/returns";
import { Product, mockProducts } from "@/models/product";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReturnProductListProps {
  items: ReturnItemType[];
  onUpdate: (updatedItems: ReturnItemType[]) => void;
  type: "sales" | "purchase";
}

export interface ReturnItemType {
  productId: string;
  productName: string;
  originalQuantity?: number;
  returnQuantity: number;
  unitPrice: number;
  subtotal: number;
  reason: ReturnReason;
  returnToStock?: boolean;
  batchCode?: string;
  expiryDate?: string;
  notes?: string;
}

export function ReturnProductList({ items, onUpdate, type }: ReturnProductListProps) {
  const updateItem = (index: number, updates: Partial<ReturnItemType>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };

    // Recalculate subtotal
    newItems[index].subtotal = newItems[index].returnQuantity * newItems[index].unitPrice;

    onUpdate(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate(newItems);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            {type === "sales" && <TableHead>Original Qty</TableHead>}
            <TableHead>Return Qty</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Reason</TableHead>
            {type === "sales" && <TableHead>Return to Stock</TableHead>}
            {type === "purchase" && <TableHead>Batch/Expiry</TableHead>}
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === "sales" ? 7 : 6} className="text-center h-24 text-muted-foreground">
                No products added to return
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                
                {type === "sales" && (
                  <TableCell>{item.originalQuantity}</TableCell>
                )}
                
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    max={item.originalQuantity}
                    value={item.returnQuantity}
                    onChange={(e) => updateItem(index, { returnQuantity: parseInt(e.target.value) || 1 })}
                    className="w-16"
                  />
                </TableCell>
                
                <TableCell>
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                
                <TableCell>
                  {formatCurrency(item.subtotal)}
                </TableCell>
                
                <TableCell>
                  <Select 
                    value={item.reason} 
                    onValueChange={(value) => updateItem(index, { reason: value as ReturnReason })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {type === "sales" ? (
                        <>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="defective">Defective</SelectItem>
                          <SelectItem value="wrong_item">Wrong Item</SelectItem>
                          <SelectItem value="customer_unsatisfied">Unsatisfied</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="defective">Defective</SelectItem>
                          <SelectItem value="wrong_delivery">Wrong Delivery</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                
                {type === "sales" && (
                  <TableCell>
                    <Checkbox 
                      checked={item.returnToStock} 
                      onCheckedChange={(checked) => updateItem(index, { returnToStock: checked as boolean })}
                    />
                  </TableCell>
                )}
                
                {type === "purchase" && (
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Input 
                        placeholder="Batch #" 
                        value={item.batchCode || ""} 
                        onChange={(e) => updateItem(index, { batchCode: e.target.value })} 
                        className="w-full"
                      />
                      <Input 
                        type="date" 
                        value={item.expiryDate || ""} 
                        onChange={(e) => updateItem(index, { expiryDate: e.target.value })} 
                        className="w-full"
                      />
                    </div>
                  </TableCell>
                )}
                
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
