
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/models/transaction';

export interface TransactionLedgerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

const TransactionLedgerDialog: React.FC<TransactionLedgerDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  transaction 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Ledger</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-medium">Transaction ID: {transaction.id}</h3>
          <p className="text-muted-foreground">Amount: ${transaction.amount}</p>
          {/* Display other transaction details as needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionLedgerDialog;
