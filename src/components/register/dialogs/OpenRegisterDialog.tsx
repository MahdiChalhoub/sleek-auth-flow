
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Register } from "@/models/transaction";

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

export default OpenRegisterDialog;
