
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ProductBatch } from '@/models/productBatch';
import BatchStatusBadge from './BatchStatusBadge';
import { formatDaysUntilExpiry } from '@/utils/expirationUtils';
import { Product } from '@/models/product';

export interface BatchTableProps {
  batches: ProductBatch[];
  isLoading?: boolean;
  onEdit?: (batch: ProductBatch) => void;
  onDelete?: (batchId: string) => void;
  product?: Product;
}

const BatchTable: React.FC<BatchTableProps> = ({ 
  batches, 
  isLoading = false, 
  onEdit, 
  onDelete,
  product 
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading batches...</div>;
  }

  if (batches.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/50">
        <p>No batches found. Add your first batch to start tracking expiry dates.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Batch Number</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map(batch => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">
                {product?.name || batch.productId}
              </TableCell>
              <TableCell>{batch.batchNumber}</TableCell>
              <TableCell>{batch.quantity}</TableCell>
              <TableCell>{batch.expiryDate}</TableCell>
              <TableCell>
                <BatchStatusBadge expiryDate={batch.expiryDate} />
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDaysUntilExpiry(batch.expiryDate)}
                </div>
              </TableCell>
              {(onEdit || onDelete) && (
                <TableCell>
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button variant="outline" size="icon" onClick={() => onEdit(batch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => onDelete(batch.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BatchTable;
