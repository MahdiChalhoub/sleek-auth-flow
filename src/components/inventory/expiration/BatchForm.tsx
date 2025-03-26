
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ExpiryDatePicker from './ExpiryDatePicker';
import { ProductBatch } from '@/models/product';

interface BatchFormProps {
  onSubmit: (batch: Omit<ProductBatch, "id">) => void;
  onCancel: () => void;
  productId: string;
}

const BatchForm: React.FC<BatchFormProps> = ({ onSubmit, onCancel, productId }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) return;

    const newBatch = {
      batchNumber,
      quantity,
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString(),
      productId // Include the productId in the batch data
    };

    onSubmit(newBatch);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="batchNumber" className="block text-sm font-medium mb-1">
          Numéro de lot
        </label>
        <Input
          id="batchNumber"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          placeholder="Entrez le numéro de lot"
          required
        />
      </div>
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-1">
          Quantité
        </label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Date d'expiration
        </label>
        <ExpiryDatePicker
          value={expiryDate}
          onChange={setExpiryDate}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!expiryDate}>
          Ajouter
        </Button>
      </div>
    </form>
  );
};

export default BatchForm;
