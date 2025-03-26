
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
import { Switch } from '@/components/ui/switch';

interface CreditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceType: InvoiceType;
  invoiceTotal: number;
  onSubmit: (
    amount: number, 
    reason: string, 
    isRefunded: boolean, 
    refundMethod?: PaymentMethod
  ) => Promise<void>;
  isSubmitting: boolean;
}

const CreditNoteDialog: React.FC<CreditNoteDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceType,
  invoiceTotal,
  onSubmit,
  isSubmitting
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [refundMethod, setRefundMethod] = useState<PaymentMethod>('cash');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(amount, reason, isRefunded, isRefunded ? refundMethod : undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Credit note error:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset form when opening
      setAmount(0);
      setReason('');
      setIsRefunded(false);
      setRefundMethod('cash');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un avoir</DialogTitle>
          <DialogDescription>
            {invoiceType === 'sale' ? 'Avoir client' : 'Avoir fournisseur'}
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
              max={invoiceTotal}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motif de l'avoir..."
              className="resize-none"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="refund"
              checked={isRefunded}
              onCheckedChange={setIsRefunded}
            />
            <Label htmlFor="refund">Remboursement immédiat</Label>
          </div>
          
          {isRefunded && (
            <div className="space-y-2">
              <Label htmlFor="refundMethod">Méthode de remboursement</Label>
              <Select value={refundMethod} onValueChange={(value) => setRefundMethod(value as PaymentMethod)}>
                <SelectTrigger id="refundMethod">
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
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || amount <= 0 || amount > invoiceTotal || !reason.trim()}>
              {isSubmitting ? 'Traitement...' : 'Créer avoir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreditNoteDialog;
