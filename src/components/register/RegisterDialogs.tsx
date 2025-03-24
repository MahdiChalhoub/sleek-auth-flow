
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Register, PaymentMethod } from "@/models/transaction";

interface OpenRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  register: Register;
  onOpenRegister: () => void;
}

export const OpenRegisterDialog: React.FC<OpenRegisterDialogProps> = ({
  isOpen,
  onClose,
  register,
  onOpenRegister
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Open Register</DialogTitle>
          <DialogDescription>
            Confirm the opening balance before opening the register.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Cash Opening Balance:</span>
              <span className="text-lg">${register.openingBalance.cash.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Card Opening Balance:</span>
              <span className="text-lg">${register.openingBalance.card.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Bank Opening Balance:</span>
              <span className="text-lg">${register.openingBalance.bank.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onOpenRegister}>
            Open Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

interface DiscrepancyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalDiscrepancy: number;
  discrepancyResolution: string;
  discrepancyNotes: string;
  handleResolutionChange: (value: string) => void;
  setDiscrepancyNotes: (notes: string) => void;
  onApproveResolution: () => void;
}

export const DiscrepancyDialog: React.FC<DiscrepancyDialogProps> = ({
  isOpen,
  onClose,
  totalDiscrepancy,
  discrepancyResolution,
  discrepancyNotes,
  handleResolutionChange,
  setDiscrepancyNotes,
  onApproveResolution
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Resolve Discrepancy</DialogTitle>
          <DialogDescription>
            Total discrepancy: ${totalDiscrepancy.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Resolution Method:</label>
              <Select value={discrepancyResolution} onValueChange={handleResolutionChange}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select resolution method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deduct_salary">Deduct from Salary</SelectItem>
                  <SelectItem value="ecart_caisse">Assign to Écart de Caisse</SelectItem>
                  <SelectItem value="approved">Approve Discrepancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes:</label>
              <textarea 
                className="mt-1.5 w-full px-3 py-2 border border-input rounded-md glass-input h-24"
                placeholder="Add notes about this discrepancy resolution..."
                value={discrepancyNotes}
                onChange={(e) => setDiscrepancyNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onApproveResolution}>
            Approve Resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
