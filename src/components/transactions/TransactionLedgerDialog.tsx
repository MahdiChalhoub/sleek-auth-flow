
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaction, LedgerEntry } from "@/models/transaction";
import { getFormattedDate, formatCurrency } from "@/utils/formatters";

export interface TransactionLedgerDialogProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionLedgerDialog: React.FC<TransactionLedgerDialogProps> = ({ transaction, onClose }) => {
  const mockLedgerEntries: LedgerEntry[] = [
    {
      id: "entry1",
      date: transaction.createdAt,
      description: `${transaction.type === 'income' ? 'Revenue' : 'Expense'} - ${transaction.description}`,
      debit: transaction.type === 'expense' ? transaction.amount : 0,
      credit: transaction.type === 'income' ? transaction.amount : 0,
      balance: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      accountId: "acc1",
      accountName: transaction.type === 'income' ? "Revenue" : "Expenses",
      type: transaction.type || 'expense'
    }
  ];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            ID: {transaction.id} | Date: {getFormattedDate(transaction.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Basic Information</h3>
            <dl className="mt-2 divide-y divide-gray-200 border-t border-b">
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="text-sm text-gray-900">{formatCurrency(transaction.amount)}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900">{transaction.type || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd className="text-sm text-gray-900">{transaction.paymentMethod}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">{transaction.status}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                <dd className="text-sm text-gray-900">{transaction.createdBy}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Additional Details</h3>
            <dl className="mt-2 divide-y divide-gray-200 border-t border-b">
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="text-sm text-gray-900">{transaction.description}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Branch</dt>
                <dd className="text-sm text-gray-900">{transaction.branchId || 'Not specified'}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Reference</dt>
                <dd className="text-sm text-gray-900">{transaction.referenceId || 'None'}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="text-sm text-gray-900">{transaction.notes || 'None'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Ledger Entries</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transaction.journalEntries?.length ? transaction.journalEntries : mockLedgerEntries).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{getFormattedDate(entry.date)}</TableCell>
                    <TableCell>{entry.accountName}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</TableCell>
                    <TableCell className="text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionLedgerDialog;
