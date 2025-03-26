
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Product, ProductBatch } from '@/models/product';
import { Progress } from '@/components/ui/progress';
import BatchStatusBadge from './BatchStatusBadge';
import { getExpiryStatusPercentage } from '@/utils/expirationUtils';

interface BatchTableProps {
  batches: ProductBatch[];
  product?: Product;
  onDeleteBatch: (batchId: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ batches, product, onDeleteBatch }) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPP', { locale: fr });
  };

  if (!batches.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun lot enregistré pour ce produit.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° de lot</TableHead>
          <TableHead>Date d'expiration</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Date d'ajout</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell className="font-medium">{batch.batchNumber}</TableCell>
            <TableCell>{formatDate(batch.expiryDate)}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <BatchStatusBadge expiryDate={batch.expiryDate} />
                <Progress 
                  value={getExpiryStatusPercentage(batch.expiryDate)} 
                  className="h-2"
                />
              </div>
            </TableCell>
            <TableCell>{batch.quantity}</TableCell>
            <TableCell>{formatDate(batch.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteBatch(batch.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BatchTable;
