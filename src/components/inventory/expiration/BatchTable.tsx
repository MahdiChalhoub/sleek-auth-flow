
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ProductBatch } from '@/models/productBatch';
import { Product } from '@/models/product';
import BatchStatusBadge from './BatchStatusBadge';
import { formatDaysUntilExpiry } from '@/utils/expirationUtils';

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
    return <div className="text-center py-4">Loading batches...</div>;
  }

  if (batches.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No batches found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batch Number</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell className="font-medium">{batch.batchNumber}</TableCell>
            <TableCell>{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <BatchStatusBadge expiryDate={batch.expiryDate} />
            </TableCell>
            <TableCell>{batch.quantity}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(batch)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(batch.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BatchTable;
