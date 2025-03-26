
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Trash2 } from 'lucide-react';
import { ProductBatch } from '@/models/product';
import BatchStatusBadge from './BatchStatusBadge';
import { format } from 'date-fns';

export interface BatchTableProps {
  refresh?: boolean;
  onDelete?: (batchId: string) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({ refresh, onDelete }) => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockBatches: ProductBatch[] = [
      {
        id: '1',
        productId: '1',
        batchNumber: 'BT-001-2023',
        quantity: 20,
        expiryDate: '2023-12-31',
        createdAt: '2023-06-15T10:00:00Z',
      },
      {
        id: '2',
        productId: '1',
        batchNumber: 'BT-002-2023',
        quantity: 15,
        expiryDate: '2024-01-15',
        createdAt: '2023-06-20T10:00:00Z',
      },
      {
        id: '3',
        productId: '2',
        batchNumber: 'BT-003-2023',
        quantity: 8,
        expiryDate: '2023-09-30',
        createdAt: '2023-07-01T10:00:00Z',
      },
    ];
    
    setBatches(mockBatches);
  }, [refresh]);
  
  // Filter batches based on search query
  const filteredBatches = batches.filter(batch => 
    batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteBatch = (batchId: string) => {
    if (onDelete) {
      onDelete(batchId);
    } else {
      // Mock delete operation
      setBatches(prev => prev.filter(batch => batch.id !== batchId));
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro de lot..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro de lot</TableHead>
              <TableHead>Date d'expiration</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Aucun lot trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                  <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>
                    <BatchStatusBadge expiryDate={batch.expiryDate} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBatch(batch.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BatchTable;
