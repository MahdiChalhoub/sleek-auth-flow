
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/models/interfaces/transactionInterfaces';

export interface TransactionLedgerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

export function TransactionLedgerDialog({
  open,
  onOpenChange,
  transaction
}: TransactionLedgerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Ledger Details</DialogTitle>
        </DialogHeader>
        
        <div>Transaction ID: {transaction.id}</div>
        <div>Amount: ${transaction.amount}</div>
        
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
