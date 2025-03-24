
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RefundMethod } from "@/models/returns";

interface RefundMethodSelectorProps {
  value: RefundMethod | "refund" | "credit" | "replace";
  onChange: (value: RefundMethod | "refund" | "credit" | "replace") => void;
  type: "sales" | "purchase";
}

export function RefundMethodSelector({ value, onChange, type }: RefundMethodSelectorProps) {
  const salesMethods = [
    {
      value: "refund",
      label: "Cash Refund",
      description: "Return payment to customer in cash or original payment method"
    },
    {
      value: "credit",
      label: "Store Credit",
      description: "Issue store credit for future purchases"
    },
    {
      value: "replace",
      label: "Replace Item",
      description: "Exchange for the same or different item"
    }
  ];

  const purchaseMethods = [
    {
      value: "cash",
      label: "Cash Refund",
      description: "Request cash payment from supplier"
    },
    {
      value: "credit_note",
      label: "Credit Note",
      description: "Receive credit for future purchases"
    },
    {
      value: "deduct_next_po",
      label: "Deduct From Next PO",
      description: "Subtract from upcoming purchase order"
    }
  ];

  const methods = type === "sales" ? salesMethods : purchaseMethods;

  return (
    <div className="space-y-3">
      <Label>Refund Method</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as any)}
        className="grid gap-3 pt-2"
      >
        {methods.map((method) => (
          <div key={method.value} className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value={method.value} id={`method-${method.value}`} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={`method-${method.value}`} className="text-sm font-medium leading-none">
                {method.label}
              </Label>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
