
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ReturnItemType } from "./ReturnProductList";
import { RefundMethod } from "@/models/returns";

interface ReturnSummaryProps {
  items: ReturnItemType[];
  type: "sales" | "purchase";
  refundMethod: RefundMethod | "refund" | "credit" | "replace";
}

export function ReturnSummary({ items, type, refundMethod }: ReturnSummaryProps) {
  const totalItems = items.reduce((total, item) => total + item.returnQuantity, 0);
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  
  // In a real app, we might apply tax adjustments, fees, etc.
  const total = subtotal;
  
  const getRefundMethodText = () => {
    if (type === "sales") {
      switch (refundMethod) {
        case "refund": return "Cash Refund";
        case "credit": return "Store Credit";
        case "replace": return "Item Replacement";
        default: return "Unknown";
      }
    } else {
      switch (refundMethod) {
        case "cash": return "Cash Refund";
        case "credit_note": return "Credit Note";
        case "deduct_next_po": return "Deduct From Next PO";
        default: return "Unknown";
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Return Summary</CardTitle>
        <CardDescription>
          {type === "sales" ? "Customer return summary" : "Supplier return summary"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Items:</span>
            <span>{totalItems}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm font-medium">
            <span>Refund Method:</span>
            <span>{getRefundMethodText()}</span>
          </div>
          
          <div className="flex justify-between border-t pt-3 text-base font-medium">
            <span>Total Refund:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
