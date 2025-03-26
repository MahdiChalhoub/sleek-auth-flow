
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TransactionStatusBadge from "@/components/TransactionStatusBadge";
import { Transaction, TransactionStatus } from "@/models/transaction";
import TransactionActions from "./TransactionActions";

interface TransactionsListProps {
  transactions: Transaction[];
  onViewLedger: (transaction: Transaction) => void;
  onChangeStatus: (transactionId: string, newStatus: TransactionStatus) => void;
  onDeleteTransaction: (transactionId: string) => void;
  isLoading?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onViewLedger,
  onChangeStatus,
  onDeleteTransaction,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <div className="flex justify-center items-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-32 bg-muted rounded mb-4"></div>
            <div className="text-sm text-muted-foreground">Loading transactions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer">
              <div className="flex items-center">
                Date
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <TransactionStatusBadge status={transaction.status} />
                </TableCell>
                <TableCell>{transaction.createdBy}</TableCell>
                <TableCell className="text-right">
                  <TransactionActions
                    transaction={transaction}
                    onViewLedger={onViewLedger}
                    onChangeStatus={onChangeStatus}
                    onDeleteTransaction={onDeleteTransaction}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsList;
