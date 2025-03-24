
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PaymentMethod } from "@/models/transaction";
import { PaymentMethodSelectorProps } from "./types/payment";
import ClientInfo from "./payment/ClientInfo";
import PaymentSummary from "./payment/PaymentSummary";
import PaymentTabs from "./payment/PaymentTabs";
import { processPaymentLogic } from "./payment/paymentUtils";

const PaymentMethodSelector = ({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentComplete,
  selectedClient
}: PaymentMethodSelectorProps) => {
  const [selectedMethods, setSelectedMethods] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0,
    not_specified: 0
  });
  
  const [activeTab, setActiveTab] = useState<PaymentMethod>('cash');
  const [useCredit, setUseCredit] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setSelectedMethods({
        cash: 0,
        card: 0,
        bank: 0,
        wave: 0,
        mobile: 0,
        not_specified: 0
      });
      setActiveTab('cash');
      setUseCredit(false);
      setUsePoints(false);
    }
  }, [isOpen]);
  
  const totalPaid = Object.values(selectedMethods).reduce((sum, val) => sum + val, 0);
  const remainingAmount = Math.max(0, amount - totalPaid);
  const changeAmount = Math.max(0, totalPaid - amount);
  
  const hasAvailableCredit = selectedClient && 
    selectedClient.creditLimit !== undefined && 
    selectedClient.outstandingBalance !== undefined &&
    (selectedClient.creditLimit - selectedClient.outstandingBalance) >= amount;
  
  const isClientBlocked = selectedClient && 
    selectedClient.creditLimit !== undefined && 
    selectedClient.outstandingBalance !== undefined &&
    selectedClient.outstandingBalance >= selectedClient.creditLimit;
  
  const clientPoints = selectedClient?.loyaltyPoints || 0;
  const pointsWorth = clientPoints * 0.01;
  const canUsePoints = clientPoints >= 500 && pointsWorth >= 5;
  const maxPointsRedemption = Math.min(pointsWorth, amount);
  
  const handleAmountChange = (method: PaymentMethod, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSelectedMethods(prev => ({
      ...prev,
      [method]: numValue
    }));
  };
  
  const handleFullPayment = (method: PaymentMethod) => {
    setSelectedMethods(prev => {
      const updatedMethods = { ...prev };
      
      Object.keys(updatedMethods).forEach(key => {
        updatedMethods[key as PaymentMethod] = 0;
      });
      
      updatedMethods[method] = amount;
      
      return updatedMethods;
    });
  };
  
  const handleSplitPayment = (method: PaymentMethod) => {
    if (remainingAmount <= 0) return;
    
    setSelectedMethods(prev => ({
      ...prev,
      [method]: prev[method] + remainingAmount
    }));
  };
  
  const processPayment = () => {
    processPaymentLogic(
      useCredit,
      hasAvailableCredit,
      usePoints,
      canUsePoints,
      clientPoints,
      amount,
      selectedMethods,
      totalPaid,
      selectedClient,
      onPaymentComplete
    );
  };
  
  const availableCredit = selectedClient && 
    selectedClient.creditLimit !== undefined && 
    selectedClient.outstandingBalance !== undefined
    ? selectedClient.creditLimit - selectedClient.outstandingBalance
    : 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Complete the sale by selecting payment methods
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          {selectedClient && selectedClient.name !== "Guest" && (
            <ClientInfo
              selectedClient={selectedClient}
              useCredit={useCredit}
              setUseCredit={setUseCredit}
              usePoints={usePoints}
              setUsePoints={setUsePoints}
              amount={amount}
              hasAvailableCredit={!!hasAvailableCredit}
              isClientBlocked={!!isClientBlocked}
              canUsePoints={canUsePoints}
              clientPoints={clientPoints}
              pointsWorth={pointsWorth}
              availableCredit={availableCredit}
              maxPointsRedemption={maxPointsRedemption}
            />
          )}
          
          <PaymentSummary
            amount={amount}
            selectedMethods={selectedMethods}
            remainingAmount={remainingAmount}
            changeAmount={changeAmount}
            useCredit={useCredit}
            usePoints={usePoints}
            canUsePoints={canUsePoints}
            pointsWorth={pointsWorth}
            maxPointsRedemption={maxPointsRedemption}
          />
          
          {!useCredit && !(usePoints && maxPointsRedemption >= amount) && (
            <PaymentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedMethods={selectedMethods}
              handleAmountChange={handleAmountChange}
              handleFullPayment={handleFullPayment}
              handleSplitPayment={handleSplitPayment}
              remainingAmount={remainingAmount}
            />
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={processPayment}
            disabled={
              (!useCredit && !usePoints && totalPaid < amount) || 
              (useCredit && !hasAvailableCredit) ||
              (usePoints && !canUsePoints) ||
              (usePoints && maxPointsRedemption < amount && totalPaid < (amount - maxPointsRedemption))
            }
            className="gap-2"
          >
            Complete Payment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodSelector;
