
import { toast } from "sonner";
import { PaymentMethod } from "@/models/transaction";
import { formatCurrency } from "@/lib/utils";

export const processPaymentLogic = (
  useCredit: boolean,
  hasAvailableCredit: boolean,
  usePoints: boolean,
  canUsePoints: boolean,
  clientPoints: number,
  amount: number,
  selectedMethods: Record<PaymentMethod, number>,
  totalPaid: number,
  selectedClient: any,
  onPaymentComplete: (details: any) => void
) => {
  if (useCredit && hasAvailableCredit) {
    onPaymentComplete({
      methods: { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0 },
      totalPaid: amount,
      change: 0,
      useCredit: true
    });
    toast.success(`Sale charged to ${selectedClient?.name}'s account`);
    return true;
  }
  
  if (usePoints && canUsePoints) {
    const pointsUsed = Math.floor(amount / 0.01);
    const actualPointsUsed = Math.min(pointsUsed, clientPoints);
    const amountCoveredByPoints = actualPointsUsed * 0.01;
    
    if (amountCoveredByPoints >= amount) {
      onPaymentComplete({
        methods: { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0 },
        totalPaid: amount,
        change: 0,
        useCredit: false,
        usePoints: true,
        pointsUsed: actualPointsUsed
      });
      toast.success(`Redeemed ${actualPointsUsed} points worth ${formatCurrency(amountCoveredByPoints)}`);
      return true;
    }
    
    const remainingToPay = amount - amountCoveredByPoints;
    
    if (totalPaid < remainingToPay) {
      toast.error(`Payment amount is insufficient. Points cover ${formatCurrency(amountCoveredByPoints)}, still need ${formatCurrency(remainingToPay - totalPaid)}`);
      return false;
    }
    
    onPaymentComplete({
      methods: selectedMethods,
      totalPaid: totalPaid + amountCoveredByPoints,
      change: totalPaid - remainingToPay > 0 ? totalPaid - remainingToPay : 0,
      useCredit: false,
      usePoints: true,
      pointsUsed: actualPointsUsed
    });
    
    toast.success(`Redeemed ${actualPointsUsed} points worth ${formatCurrency(amountCoveredByPoints)}`);
    
    if (totalPaid > remainingToPay) {
      toast.info(`Please give ${formatCurrency(totalPaid - remainingToPay)} change to the customer`);
    }
    
    return true;
  }
  
  if (totalPaid < amount) {
    toast.error("Payment amount is insufficient");
    return false;
  }
  
  const changeAmount = Math.max(0, totalPaid - amount);
  
  onPaymentComplete({
    methods: selectedMethods,
    totalPaid,
    change: changeAmount,
    useCredit: false
  });
  
  if (changeAmount > 0) {
    toast.info(`Please give ${changeAmount.toFixed(2)} change to the customer`);
  }
  
  return true;
};
