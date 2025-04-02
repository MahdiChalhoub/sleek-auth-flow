
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/models/transaction';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/utils/formatters';

export interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}) => {
  const renderStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case 'verified':
        variant = "default";
        break;
      case 'locked':
        variant = "secondary";
        break;
      case 'open':
        variant = "outline";
        break;
      default:
        variant = "default";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No transactions found</div>;
  }

  return (
    <div>
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id.substring(0, 8)}</TableCell>
                <TableCell>{transaction.createdAt ? formatDate(transaction.createdAt) : '-'}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount ? formatCurrency(transaction.amount) : '-'}</TableCell>
                <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{transaction.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
