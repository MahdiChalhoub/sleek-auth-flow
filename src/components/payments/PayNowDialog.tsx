
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvoiceType, PaymentMethod } from '@/models/payment';
import { Textarea } from '@/components/ui/textarea';

interface PayNowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceType: InvoiceType;
  amountDue: number;
  onSubmit: (amount: number, method: PaymentMethod, notes?: string) => Promise<void>;
  isSubmitting: boolean;
}

const PayNowDialog: React.FC<PayNowDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceType,
  amountDue,
  onSubmit,
  isSubmitting
}) => {
  const [amount, setAmount] = useState<number>(amountDue);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(amount, paymentMethod, notes);
      onOpenChange(false);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset form when opening
      setAmount(amountDue);
      setPaymentMethod('cash');
      setNotes('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            {invoiceType === 'sale' ? 'Paiement client' : 
             invoiceType === 'purchase' ? 'Paiement fournisseur' : 'Paiement de dépense'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={amountDue}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">Montant dû: {amountDue.toFixed(2)}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Sélectionnez une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="card">Carte</SelectItem>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes supplémentaires..."
              className="resize-none"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || amount <= 0 || amount > amountDue}>
              {isSubmitting ? 'Traitement...' : `Enregistrer ${amount.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayNowDialog;
