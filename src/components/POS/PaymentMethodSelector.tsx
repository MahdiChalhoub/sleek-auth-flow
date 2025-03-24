import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Landmark,
  ArrowRight,
  Check,
  User,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PaymentMethod } from "@/models/transaction";
import { Client } from "@/models/client";
import { formatCurrency } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: (paymentDetails: {
    methods: Record<PaymentMethod, number>;
    totalPaid: number;
    change: number;
    useCredit?: boolean;
    usePoints?: boolean;
    pointsUsed?: number;
  }) => void;
  selectedClient?: {
    name: string;
    isVip?: boolean;
    creditLimit?: number;
    outstandingBalance?: number;
    loyaltyPoints?: number;
  } | null;
}

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
    mobile: 0
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
        mobile: 0
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
    if (useCredit && hasAvailableCredit) {
      onPaymentComplete({
        methods: { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0 },
        totalPaid: amount,
        change: 0,
        useCredit: true
      });
      toast.success(`Sale charged to ${selectedClient?.name}'s account`);
      return;
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
        return;
      }
      
      const remainingToPay = amount - amountCoveredByPoints;
      
      if (totalPaid < remainingToPay) {
        toast.error(`Payment amount is insufficient. Points cover ${formatCurrency(amountCoveredByPoints)}, still need ${formatCurrency(remainingToPay - totalPaid)}`);
        return;
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
      
      return;
    }
    
    if (totalPaid < amount) {
      toast.error("Payment amount is insufficient");
      return;
    }
    
    onPaymentComplete({
      methods: selectedMethods,
      totalPaid,
      change: changeAmount,
      useCredit: false
    });
    
    if (changeAmount > 0) {
      toast.info(`Please give ${changeAmount.toFixed(2)} change to the customer`);
    }
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
            <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <p className="font-medium">{selectedClient.name}</p>
                {selectedClient.isVip && (
                  <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">VIP</span>
                )}
                {isClientBlocked && (
                  <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Blocked
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-1 text-sm">
                {selectedClient.creditLimit !== undefined && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credit Limit:</span>
                      <span>${selectedClient.creditLimit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outstanding:</span>
                      <span>${selectedClient.outstandingBalance?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-muted-foreground">Available Credit:</span>
                      <span className={availableCredit <= 0 ? "text-red-500" : "text-green-500"}>
                        ${availableCredit.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                
                {clientPoints > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loyalty Points:</span>
                      <span className="text-purple-500 font-medium">{clientPoints} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Points Value:</span>
                      <span>${(clientPoints * 0.01).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-2 flex flex-col gap-2">
                {hasAvailableCredit && !isClientBlocked && (
                  <Button 
                    variant={useCredit ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setUseCredit(!useCredit);
                      if (!useCredit) setUsePoints(false);
                    }}
                  >
                    {useCredit ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Charge to Account
                      </>
                    ) : "Charge to Account"}
                  </Button>
                )}
                
                {canUsePoints && !isClientBlocked && (
                  <Button 
                    variant={usePoints ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setUsePoints(!usePoints);
                      if (!usePoints) setUseCredit(false);
                    }}
                  >
                    {usePoints ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Redeem {Math.floor(amount / 0.01) > clientPoints ? clientPoints : Math.floor(amount / 0.01)} Points
                      </>
                    ) : `Redeem Points (${formatCurrency(Math.min(pointsWorth, amount))})`}
                  </Button>
                )}
              </div>
            </div>
          )}
          
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
          
          {!useCredit && !(usePoints && maxPointsRedemption >= amount) && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PaymentMethod)}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="cash" className="flex flex-col items-center gap-1 h-16">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">Cash</span>
                </TabsTrigger>
                <TabsTrigger value="card" className="flex flex-col items-center gap-1 h-16">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs">Card</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex flex-col items-center gap-1 h-16">
                  <Landmark className="h-4 w-4" />
                  <span className="text-xs">Bank</span>
                </TabsTrigger>
                <TabsTrigger value="wave" className="flex flex-col items-center gap-1 h-16">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs">Wave</span>
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex flex-col items-center gap-1 h-16">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-xs">Mobile</span>
                </TabsTrigger>
              </TabsList>
              
              {(["cash", "card", "bank", "wave", "mobile"] as PaymentMethod[]).map(method => (
                <TabsContent key={method} value={method} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="number"
                          value={selectedMethods[method].toString()}
                          onChange={(e) => handleAmountChange(method, e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          onClick={() => handleFullPayment(method)}
                          disabled={remainingAmount <= 0}
                          size="sm"
                        >
                          Full
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleSplitPayment(method)}
                          disabled={remainingAmount <= 0}
                          size="sm"
                        >
                          Split
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 20, 50].map(quickAmount => (
                        <Button
                          key={quickAmount}
                          variant="outline"
                          onClick={() => handleAmountChange(method, String(quickAmount))}
                          size="sm"
                        >
                          ${quickAmount}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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
