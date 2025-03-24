
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Landmark,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: () => void;
}

// Payment method types
type PaymentMethod = 'cash' | 'card' | 'bank' | 'wave' | 'mobile';

const PaymentMethodSelector = ({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentComplete 
}: PaymentMethodSelectorProps) => {
  const [selectedMethods, setSelectedMethods] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0
  });
  
  const [activeTab, setActiveTab] = useState<PaymentMethod>('cash');
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedMethods({
        cash: 0,
        card: 0,
        bank: 0,
        wave: 0,
        mobile: 0
      });
      setActiveTab('cash');
    }
  }, [isOpen]);
  
  // Calculate total payment amount across all methods
  const totalPaid = Object.values(selectedMethods).reduce((sum, val) => sum + val, 0);
  
  // Calculate remaining amount to be paid
  const remainingAmount = Math.max(0, amount - totalPaid);
  
  // Calculate change to be given back
  const changeAmount = Math.max(0, totalPaid - amount);
  
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
    setSelectedMethods(prev => ({
      ...prev,
      [method]: remainingAmount
    }));
  };
  
  // Process payment
  const processPayment = () => {
    if (totalPaid < amount) {
      toast.error("Payment amount is insufficient");
      return;
    }
    
    onPaymentComplete();
    
    // Show change information if needed
    if (changeAmount > 0) {
      toast.info(`Please give ${changeAmount.toFixed(2)} change to the customer`);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Payment Summary */}
          <div className="grid gap-4 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            
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
          </div>
          
          {/* Payment Methods */}
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={processPayment}
            disabled={totalPaid < amount}
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
