
import React from 'react';
import { Transaction } from '@/models/interfaces/transactionInterfaces';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

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
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const renderStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'open': 'bg-green-100 text-green-800',
      'closed': 'bg-blue-100 text-blue-800',
      'reconciled': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  const renderTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'sale': 'bg-green-100 text-green-800',
      'expense': 'bg-red-100 text-red-800',
      'refund': 'bg-amber-100 text-amber-800',
      'transfer': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'} variant="outline">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View detailed information about this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Transaction #{transaction.id}</h3>
              <p className="text-sm text-muted-foreground">
                {transaction.created_at ? formatDate(transaction.created_at) : 'No date provided'}
              </p>
            </div>
            <div className="flex space-x-2">
              {renderTypeBadge(transaction.type)}
              {renderStatusBadge(transaction.status)}
            </div>
          </div>
          
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{formatAmount(transaction.amount)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
              </div>
              
              {transaction.notes && (
                <div className="pt-2">
                  <span className="text-muted-foreground block mb-1">Notes:</span>
                  <p className="text-sm p-2 bg-muted rounded">{transaction.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button">
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
