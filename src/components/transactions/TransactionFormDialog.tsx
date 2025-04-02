
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionFormData } from '@/models/interfaces/transactionInterfaces';
import { Button } from '@/components/ui/button';

export interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<boolean>;
  businesses: any[];
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  businesses
}: TransactionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        
        <div>Transaction Form Content</div>
        
        <Button onClick={() => onSubmit({})}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
