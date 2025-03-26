
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import BatchStatusBadge from './BatchStatusBadge';
import { ProductBatch, Product } from '@/models/product';

export interface BatchTableProps {
  batches: ProductBatch[];
  product: Product;
  onDeleteBatch: (batchId: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ batches, product, onDeleteBatch }) => {
  if (!batches || batches.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucun lot n'a été enregistré pour ce produit.
      </div>
    );
  }
  
  // Sort batches by expiry date (closest first)
  const sortedBatches = [...batches].sort((a, b) => 
    new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de lot</TableHead>
            <TableHead className="text-right">Quantité</TableHead>
            <TableHead>Date d'expiration</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBatches.map((batch) => {
            const expiryDate = new Date(batch.expiryDate);
            const timeToExpiry = formatDistanceToNow(expiryDate, { addSuffix: true, locale: fr });
            
            return (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                <TableCell className="text-right">{batch.quantity}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{new Date(batch.expiryDate).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">{timeToExpiry}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <BatchStatusBadge expiryDate={batch.expiryDate} />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDeleteBatch(batch.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BatchTable;
