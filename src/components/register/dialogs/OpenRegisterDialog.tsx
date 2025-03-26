
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [openingBalances, setOpeningBalances] = useState<Record<PaymentMethod, number>>({
    cash: register.openingBalance.cash || 0,
    card: register.openingBalance.card || 0,
    bank: register.openingBalance.bank || 0,
    wave: register.openingBalance.wave || 0,
    mobile: register.openingBalance.mobile || 0,
    not_specified: register.openingBalance.not_specified || 0
  });

  const handleBalanceChange = (method: PaymentMethod, value: string) => {
    const numValue = parseFloat(value) || 0;
    setOpeningBalances(prev => ({
      ...prev,
      [method]: numValue,
    }));
  };

  const handleOpenRegister = () => {
    // Update the register's opening balance with the values entered
    register.openingBalance = openingBalances;
    onOpenRegister();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Ouvrir la Caisse</DialogTitle>
          <DialogDescription>
            Confirmez le solde d'ouverture avant d'ouvrir la caisse.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cash-balance">Solde en Espèces:</Label>
              <div className="flex items-center">
                <Input
                  id="cash-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingBalances.cash}
                  onChange={(e) => handleBalanceChange('cash', e.target.value)}
                  className="flex-1"
                />
                <div className="ml-4 w-24 text-right">
                  <span className="text-sm text-muted-foreground">
                    Attendu: ${register.expectedBalance.cash.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-balance">Solde Carte:</Label>
              <div className="flex items-center">
                <Input
                  id="card-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingBalances.card}
                  onChange={(e) => handleBalanceChange('card', e.target.value)}
                  className="flex-1"
                />
                <div className="ml-4 w-24 text-right">
                  <span className="text-sm text-muted-foreground">
                    Attendu: ${register.expectedBalance.card.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank-balance">Solde Bancaire:</Label>
              <div className="flex items-center">
                <Input
                  id="bank-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingBalances.bank}
                  onChange={(e) => handleBalanceChange('bank', e.target.value)}
                  className="flex-1"
                />
                <div className="ml-4 w-24 text-right">
                  <span className="text-sm text-muted-foreground">
                    Attendu: ${register.expectedBalance.bank.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wave-balance">Solde Wave:</Label>
              <div className="flex items-center">
                <Input
                  id="wave-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingBalances.wave}
                  onChange={(e) => handleBalanceChange('wave', e.target.value)}
                  className="flex-1"
                />
                <div className="ml-4 w-24 text-right">
                  <span className="text-sm text-muted-foreground">
                    Attendu: ${register.expectedBalance.wave.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile-balance">Solde Mobile:</Label>
              <div className="flex items-center">
                <Input
                  id="mobile-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingBalances.mobile}
                  onChange={(e) => handleBalanceChange('mobile', e.target.value)}
                  className="flex-1"
                />
                <div className="ml-4 w-24 text-right">
                  <span className="text-sm text-muted-foreground">
                    Attendu: ${register.expectedBalance.mobile.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleOpenRegister}>
            Ouvrir la Caisse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenRegisterDialog;
