
import React from 'react';
import { ClientTransaction } from '@/models/clientTransaction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ClientTransactionsTableProps {
  transactions: ClientTransaction[];
  isLoading: boolean;
}

export const ClientTransactionsTable: React.FC<ClientTransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`capitalize ${
                  transaction.type === 'invoice'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : transaction.type === 'payment'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : transaction.type === 'return'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                {transaction.type}
              </Badge>
            </TableCell>
            <TableCell>{transaction.referenceId}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {transaction.description}
            </TableCell>
            <TableCell className={`text-right font-medium ${
              transaction.type === 'payment' ? 'text-green-600' : 
              transaction.type === 'return' ? 'text-orange-600' : ''
            }`}>
              {transaction.type === 'payment' ? '−' : ''}{formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  transaction.status === 'completed'
                    ? 'default'
                    : transaction.status === 'pending'
                    ? 'secondary'
                    : 'destructive'
                }
                className="capitalize"
              >
                {transaction.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
