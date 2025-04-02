
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Ledger</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-medium">Transaction ID: {transaction.id}</h3>
          <p className="text-muted-foreground">Amount: ${transaction.amount.toFixed(2)}</p>
          <p className="text-muted-foreground">Type: {transaction.type}</p>
          <p className="text-muted-foreground">Status: {transaction.status}</p>
          {transaction.created_at && (
            <p className="text-muted-foreground">Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
          )}
          {transaction.notes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium">Notes:</h4>
              <p className="text-muted-foreground">{transaction.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
