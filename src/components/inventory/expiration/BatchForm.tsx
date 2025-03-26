
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface BatchFormProps {
  productId?: string;
  onBatchAdded?: () => void;
}

const BatchForm: React.FC<BatchFormProps> = ({ productId, onBatchAdded }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() + 6))
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchNumber.trim()) {
      toast.error("Veuillez saisir un numéro de lot");
      return;
    }
    
    if (!expiryDate) {
      toast.error("Veuillez sélectionner une date d'expiration");
      return;
    }
    
    if (quantity < 1) {
      toast.error("La quantité doit être supérieure à zéro");
      return;
    }
    
    // In a real app, this would make an API call
    console.log("Batch added:", {
      productId,
      batchNumber,
      quantity,
      expiryDate: format(expiryDate, 'yyyy-MM-dd'),
    });
    
    toast.success("Lot ajouté avec succès");
    
    // Reset form
    setBatchNumber('');
    setQuantity(1);
    setExpiryDate(new Date(new Date().setMonth(new Date().getMonth() + 6)));
    
    // Notify parent component
    if (onBatchAdded) {
      onBatchAdded();
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Numéro de lot</Label>
            <Input
              id="batchNumber"
              placeholder="ex: BT-001-2023"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date d'expiration</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, 'dd/MM/yyyy') : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button type="submit" className="w-full">
            Ajouter le lot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BatchForm;
