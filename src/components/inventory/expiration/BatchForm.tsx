
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ProductBatch } from '@/models/product';
import ExpiryDatePicker from './ExpiryDatePicker';

interface BatchFormProps {
  onAddBatch: (batch: Omit<ProductBatch, 'id'>) => void;
  isSubmitting?: boolean;
}

const BatchForm: React.FC<BatchFormProps> = ({ onAddBatch, isSubmitting = false }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchNumber || !expiryDate || quantity <= 0) return;
    
    onAddBatch({
      batchNumber,
      quantity,
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString()
    });
    
    // Reset form
    setBatchNumber('');
    setQuantity(1);
    setExpiryDate(undefined);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Numéro de lot</Label>
            <Input
              id="batchNumber"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="ex: LOT12345"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date d'expiration</Label>
            <ExpiryDatePicker 
              value={expiryDate} 
              onChange={setExpiryDate}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !batchNumber || !expiryDate || quantity <= 0}
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter le lot'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BatchForm;
