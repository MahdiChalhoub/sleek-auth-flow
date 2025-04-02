
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/models/interfaces/transactionInterfaces';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

export interface TransactionLedgerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-800',
  reconciled: 'bg-green-100 text-green-800'
};

export function TransactionLedgerDialog({
  open,
  onOpenChange,
  transaction
}: TransactionLedgerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Transaction ID</h4>
              <p className="text-sm">{transaction.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Date</h4>
              <p className="text-sm">{formatDate(transaction.created_at || '')}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Amount</h4>
              <p className="text-lg font-bold">${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge className={statusColors[transaction.status]}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Type</h4>
            <p className="text-sm">{transaction.type}</p>
          </div>
          
          {transaction.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Notes</h4>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                {transaction.notes}
              </p>
            </div>
          )}
          
          {transaction.reference_id && (
            <div>
              <h4 className="text-sm font-medium mb-1">Reference</h4>
              <p className="text-sm">
                {transaction.reference_type}: {transaction.reference_id}
              </p>
            </div>
          )}
          
          <div className="pt-4 flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
