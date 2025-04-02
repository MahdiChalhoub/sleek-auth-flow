
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Ledger</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
              <p className="text-base">{transaction.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="text-base">{format(new Date(transaction.createdAt), 'PPP p')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-base">{transaction.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
              <p className="text-base font-medium">${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
              <p className="text-base capitalize">{transaction.paymentMethod}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="text-base capitalize">{transaction.status}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Journal Entries</h3>
            {transaction.journalEntries && transaction.journalEntries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.journalEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.account}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>
                        {entry.type === 'debit' ? `$${entry.amount.toFixed(2)}` : ''}
                      </TableCell>
                      <TableCell>
                        {entry.type === 'credit' ? `$${entry.amount.toFixed(2)}` : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4 bg-muted/50 rounded-md">
                <p className="text-muted-foreground">No journal entries found for this transaction</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionLedgerDialog;
