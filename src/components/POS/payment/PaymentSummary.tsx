
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { PaymentSummaryProps } from "../types/payment";
import { PaymentMethod } from "@/models/transaction";

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  selectedMethods,
  remainingAmount,
  changeAmount,
  useCredit,
  usePoints,
  canUsePoints,
  pointsWorth,
  maxPointsRedemption
}) => {
  return (
    <div className="grid gap-4 mb-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Total Amount:</span>
        <span className="font-medium">${amount.toFixed(2)}</span>
      </div>
      
      {usePoints && canUsePoints && (
        <div className="flex justify-between text-purple-600">
          <span>Points Redemption:</span>
          <span>-${Math.min(pointsWorth, amount).toFixed(2)}</span>
        </div>
      )}
      
      {usePoints && canUsePoints && maxPointsRedemption < amount && (
        <div className="flex justify-between text-blue-600">
          <span>Remaining to Pay:</span>
          <span>${(amount - maxPointsRedemption).toFixed(2)}</span>
        </div>
      )}
      
      {!useCredit && !usePoints && (
        <>
          {Object.entries(selectedMethods).map(([method, value]) => (
            value > 0 && (
              <div key={method} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{method}:</span>
                <span>${value.toFixed(2)}</span>
              </div>
            )
          ))}
          
          {remainingAmount > 0 && (
            <div className="flex justify-between text-blue-600 dark:text-blue-400">
              <span>Remaining:</span>
              <span>${remainingAmount.toFixed(2)}</span>
            </div>
          )}
          
          {changeAmount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Change:</span>
              <span>${changeAmount.toFixed(2)}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSummary;
