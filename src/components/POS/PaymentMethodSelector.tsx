
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
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PaymentMethod } from "@/models/transaction";

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: (paymentDetails: {
    methods: Record<PaymentMethod, number>;
    totalPaid: number;
    change: number;
  }) => void;
  selectedClient?: {
    name: string;
    isVip?: boolean;
    creditLimit?: number;
    outstandingBalance?: number;
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
  
  // Reset state when dialog opens
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
    }
  }, [isOpen]);
  
  // Calculate total payment amount across all methods
  const totalPaid = Object.values(selectedMethods).reduce((sum, val) => sum + val, 0);
  
  // Calculate remaining amount to be paid
  const remainingAmount = Math.max(0, amount - totalPaid);
  
  // Calculate change to be given back
  const changeAmount = Math.max(0, totalPaid - amount);
  
  // Check if client has available credit
  const hasAvailableCredit = selectedClient && 
    selectedClient.creditLimit !== undefined && 
    selectedClient.outstandingBalance !== undefined &&
    (selectedClient.creditLimit - selectedClient.outstandingBalance) >= amount;
  
  // Handle payment amount change
  const handleAmountChange = (method: PaymentMethod, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSelectedMethods(prev => ({
      ...prev,
      [method]: numValue
    }));
  };
  
  // Handle full payment button
  const handleFullPayment = (method: PaymentMethod) => {
    setSelectedMethods(prev => {
      const updatedMethods = { ...prev };
      
      // Reset all payment methods
      Object.keys(updatedMethods).forEach(key => {
        updatedMethods[key as PaymentMethod] = 0;
      });
      
      // Set the selected method to the full amount
      updatedMethods[method] = amount;
      
      return updatedMethods;
    });
  };
  
  // Process payment
  const processPayment = () => {
    // If using client credit
    if (useCredit && hasAvailableCredit) {
      onPaymentComplete({
        methods: { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0 },
        totalPaid: amount,
        change: 0
      });
      toast.success(`Sale charged to ${selectedClient?.name}'s account`);
      return;
    }
    
    // For regular payment
    if (totalPaid < amount) {
      toast.error("Payment amount is insufficient");
      return;
    }
    
    onPaymentComplete({
      methods: selectedMethods,
      totalPaid,
      change: changeAmount
    });
    
    // Show change information if needed
    if (changeAmount > 0) {
      toast.info(`Please give ${changeAmount.toFixed(2)} change to the customer`);
    }
  };
  
  // Calculate available credit
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
          {/* Client Info (if selected) */}
          {selectedClient && selectedClient.name !== "Guest" && (
            <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <p className="font-medium">{selectedClient.name}</p>
                {selectedClient.isVip && (
                  <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">VIP</span>
                )}
              </div>
              
              {selectedClient.creditLimit !== undefined && (
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Limit:</span>
                    <span>${selectedClient.creditLimit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Outstanding:</span>
                    <span>${selectedClient.outstandingBalance?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              )}
              
              {/* Credit Payment Option */}
              {hasAvailableCredit && (
                <div className="mt-2">
                  <Button 
                    variant={useCredit ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                    onClick={() => setUseCredit(!useCredit)}
                  >
                    {useCredit ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Charge to Account
                      </>
                    ) : "Charge to Account"}
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Payment Summary */}
          <div className="grid gap-4 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            
            {!useCredit && (
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
          
          {/* Payment Methods (only show if not using credit) */}
          {!useCredit && (
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
                      <Button 
                        variant="outline" 
                        onClick={() => handleFullPayment(method)}
                        disabled={remainingAmount <= 0}
                      >
                        Full (${remainingAmount.toFixed(2)})
                      </Button>
                    </div>
                    
                    {/* Quick amount buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 10, 20, 50].map(quickAmount => (
                        <Button
                          key={quickAmount}
                          variant="outline"
                          onClick={() => handleAmountChange(method, String(quickAmount))}
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
            disabled={!useCredit && totalPaid < amount}
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
