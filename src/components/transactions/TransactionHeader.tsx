
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export interface TransactionHeaderProps {
  onExport: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Manage and track all financial transactions
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onExport} className="sm:self-start flex gap-2">
        <FileDown className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

export default TransactionHeader;
