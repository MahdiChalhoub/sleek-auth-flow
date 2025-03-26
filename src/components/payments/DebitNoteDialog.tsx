
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
import { InvoiceType } from '@/models/payment';
import { Textarea } from '@/components/ui/textarea';

interface DebitNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceType: InvoiceType;
  onSubmit: (amount: number, reason: string) => Promise<void>;
  isSubmitting: boolean;
}

const DebitNoteDialog: React.FC<DebitNoteDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceType,
  onSubmit,
  isSubmitting
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(amount, reason);
      onOpenChange(false);
    } catch (error) {
      console.error('Debit note error:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset form when opening
      setAmount(0);
      setReason('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une note de débit</DialogTitle>
          <DialogDescription>
            {invoiceType === 'sale' ? 'Note de débit client' : 'Note de débit fournisseur'}
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
              placeholder="Motif de la note de débit..."
              className="resize-none"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || amount <= 0 || !reason.trim()}>
              {isSubmitting ? 'Traitement...' : 'Créer note de débit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DebitNoteDialog;
