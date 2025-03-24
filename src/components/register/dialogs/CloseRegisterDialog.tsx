
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Register, PaymentMethod } from "@/models/transaction";

interface CloseRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  register: Register;
  closingBalances: Record<PaymentMethod, number>;
  handleBalanceChange: (method: PaymentMethod, value: string) => void;
  onCloseRegister: () => void;
}

export const CloseRegisterDialog: React.FC<CloseRegisterDialogProps> = ({
  isOpen,
  onClose,
  register,
  closingBalances,
  handleBalanceChange,
  onCloseRegister
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle>Close Register</DialogTitle>
          <DialogDescription>
            Please enter the closing balances for all payment methods.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cash Closing Balance:</label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  type="number" 
                  value={closingBalances.cash.toString()}
                  onChange={(e) => handleBalanceChange('cash', e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expected: ${register.expectedBalance.cash.toFixed(2)}</span>
                <span className={`${closingBalances.cash !== register.expectedBalance.cash ? 'text-yellow-500 font-medium' : ''}`}>
                  Difference: ${(closingBalances.cash - register.expectedBalance.cash).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Closing Balance:</label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  type="number" 
                  value={closingBalances.card.toString()}
                  onChange={(e) => handleBalanceChange('card', e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expected: ${register.expectedBalance.card.toFixed(2)}</span>
                <span className={`${closingBalances.card !== register.expectedBalance.card ? 'text-yellow-500 font-medium' : ''}`}>
                  Difference: ${(closingBalances.card - register.expectedBalance.card).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Closing Balance:</label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  type="number" 
                  value={closingBalances.bank.toString()}
                  onChange={(e) => handleBalanceChange('bank', e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expected: ${register.expectedBalance.bank.toFixed(2)}</span>
                <span className={`${closingBalances.bank !== register.expectedBalance.bank ? 'text-yellow-500 font-medium' : ''}`}>
                  Difference: ${(closingBalances.bank - register.expectedBalance.bank).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Wave Closing Balance:</label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  type="number" 
                  value={closingBalances.wave.toString()}
                  onChange={(e) => handleBalanceChange('wave', e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expected: ${register.expectedBalance.wave.toFixed(2)}</span>
                <span className={`${closingBalances.wave !== register.expectedBalance.wave ? 'text-yellow-500 font-medium' : ''}`}>
                  Difference: ${(closingBalances.wave - register.expectedBalance.wave).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Closing Balance:</label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  type="number" 
                  value={closingBalances.mobile.toString()}
                  onChange={(e) => handleBalanceChange('mobile', e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expected: ${register.expectedBalance.mobile.toFixed(2)}</span>
                <span className={`${closingBalances.mobile !== register.expectedBalance.mobile ? 'text-yellow-500 font-medium' : ''}`}>
                  Difference: ${(closingBalances.mobile - register.expectedBalance.mobile).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Other Closing Balance:</label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input 
                  type="number" 
                  value={closingBalances.not_specified.toString()}
                  onChange={(e) => handleBalanceChange('not_specified', e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expected: ${register.expectedBalance.not_specified.toFixed(2)}</span>
                <span className={`${closingBalances.not_specified !== register.expectedBalance.not_specified ? 'text-yellow-500 font-medium' : ''}`}>
                  Difference: ${(closingBalances.not_specified - register.expectedBalance.not_specified).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCloseRegister}>
            Close Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseRegisterDialog;
