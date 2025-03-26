
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ProductBatch, Product } from '@/models/product';
import BatchStatusBadge from './BatchStatusBadge';
import { formatDaysUntilExpiry } from '@/utils/expirationUtils';

interface BatchTableProps {
  batches: ProductBatch[];
  product: Product;
  onDeleteBatch: (batchId: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ batches, product, onDeleteBatch }) => {
  if (batches.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Aucun lot trouvé pour ce produit.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lot</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Expire le</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map(batch => (
          <TableRow key={batch.id}>
            <TableCell className="font-medium">
              {batch.batchNumber}
            </TableCell>
            <TableCell>{batch.quantity}</TableCell>
            <TableCell>
              {batch.expiryDate ? (
                <div className="flex flex-col">
                  <span>{format(parseISO(batch.expiryDate), 'dd MMM yyyy', { locale: fr })}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatDaysUntilExpiry(batch.expiryDate)}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Non défini</span>
              )}
            </TableCell>
            <TableCell>
              <BatchStatusBadge expiryDate={batch.expiryDate} />
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDeleteBatch(batch.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BatchTable;
