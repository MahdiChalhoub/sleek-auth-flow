
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReturnReason } from "@/models/returns";

interface ReturnReasonSelectorProps {
  value: ReturnReason;
  onChange: (value: ReturnReason) => void;
  type: "sales" | "purchase";
}

export function ReturnReasonSelector({ value, onChange, type }: ReturnReasonSelectorProps) {
  const salesReasons: Array<{ value: ReturnReason; label: string; description: string }> = [
    {
      value: "damaged",
      label: "Damaged",
      description: "Product was damaged upon receipt or during use"
    },
    {
      value: "defective",
      label: "Defective",
      description: "Product doesn't work as expected or has quality issues"
    },
    {
      value: "wrong_item",
      label: "Wrong Item",
      description: "Customer received incorrect product or size"
    },
    {
      value: "customer_unsatisfied",
      label: "Customer Unsatisfied",
      description: "Product didn't meet customer expectations"
    }
  ];

  const purchaseReasons: Array<{ value: ReturnReason; label: string; description: string }> = [
    {
      value: "damaged",
      label: "Damaged",
      description: "Product was damaged upon receipt from supplier"
    },
    {
      value: "defective",
      label: "Defective",
      description: "Product doesn't work as expected or has quality issues"
    },
    {
      value: "wrong_delivery",
      label: "Wrong Delivery",
      description: "Supplier shipped incorrect product or quantity"
    },
    {
      value: "expired",
      label: "Expired",
      description: "Product was expired or too close to expiration date"
    }
  ];

  const reasons = type === "sales" ? salesReasons : purchaseReasons;

  return (
    <div className="space-y-3">
      <Label>Return Reason</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as ReturnReason)}
        className="grid gap-3 pt-2"
      >
        {reasons.map((reason) => (
          <div key={reason.value} className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value={reason.value} id={`reason-${reason.value}`} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={`reason-${reason.value}`} className="text-sm font-medium leading-none">
                {reason.label}
              </Label>
              <p className="text-sm text-muted-foreground">{reason.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
