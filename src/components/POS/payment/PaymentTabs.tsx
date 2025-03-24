
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Wallet, Smartphone, Landmark } from "lucide-react";
import { PaymentTabsProps } from "../types/payment";
import { PaymentMethod } from "@/models/transaction";

const PaymentTabs: React.FC<PaymentTabsProps> = ({
  activeTab,
  setActiveTab,
  selectedMethods,
  handleAmountChange,
  handleFullPayment,
  handleSplitPayment,
  remainingAmount
}) => {
  return (
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
  );
};

export default PaymentTabs;
