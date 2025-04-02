
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/models/interfaces/transactionInterfaces';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

interface TransactionLedgerDialogProps {
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p>{formatDate(transaction.created_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
              <Badge variant={transaction.type === 'expense' ? 'destructive' : 'default'}>
                {transaction.type}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="font-medium">${transaction.amount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge 
                variant={
                  transaction.status === 'closed' ? 'outline' : 
                  transaction.status === 'reconciled' ? 'success' : 'secondary'
                }
              >
                {transaction.status}
              </Badge>
            </div>
          </div>
          
          {transaction.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="text-sm">{transaction.notes}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium mb-2">Journal Entries</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mock journal entries for now */}
                <TableRow>
                  <TableCell>Cash</TableCell>
                  <TableCell>Credit</TableCell>
                  <TableCell className="text-right">${transaction.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{transaction.type === 'expense' ? 'Expenses' : 'Revenue'}</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell className="text-right">${transaction.amount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
