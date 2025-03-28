
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Product } from '@/models/product';
import { ProductBatch } from '@/models/productBatch';

export interface BatchTableProps {
  product: Product;
  batches: ProductBatch[];
  onDeleteBatch: (batchId: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ product, batches, onDeleteBatch }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'PPP');
      }
      return 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <p>No batches found for this product.</p>
        <p className="text-sm">Add a new batch to track expiration dates.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">{batch.batchNumber}</TableCell>
              <TableCell>{batch.quantity}</TableCell>
              <TableCell>{formatDate(batch.expiryDate)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteBatch(batch.id)}
                  aria-label="Delete batch"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BatchTable;
