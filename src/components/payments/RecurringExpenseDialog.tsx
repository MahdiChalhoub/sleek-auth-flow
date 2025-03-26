
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaymentMethod, RecurringExpense } from '@/models/payment';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecurringExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Partial<RecurringExpense>;
  isEditing?: boolean;
}

const RecurringExpenseDialog: React.FC<RecurringExpenseDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  isEditing = false
}) => {
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [frequency, setFrequency] = useState<RecurringExpense['frequency']>(initialData?.frequency || 'monthly');
  const [customDays, setCustomDays] = useState<number | undefined>(initialData?.customDays);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : undefined
  );
  const [isAutoPaid, setIsAutoPaid] = useState<boolean>(initialData?.isAutoPaid || false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(initialData?.paymentMethod || 'bank_transfer');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive !== undefined ? initialData.isActive : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      amount,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      startDate: startDate?.toISOString() || new Date().toISOString(),
      endDate: endDate?.toISOString(),
      isAutoPaid,
      paymentMethod: isAutoPaid ? paymentMethod : undefined,
      lastProcessedDate: initialData?.lastProcessedDate,
      notes: notes || undefined,
      isActive,
    };
    
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Recurring expense error:', error);
    }
  };

  const resetForm = () => {
    if (initialData && isEditing) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount || 0);
      setFrequency(initialData.frequency || 'monthly');
      setCustomDays(initialData.customDays);
      setStartDate(initialData.startDate ? new Date(initialData.startDate) : new Date());
      setEndDate(initialData.endDate ? new Date(initialData.endDate) : undefined);
      setIsAutoPaid(initialData.isAutoPaid || false);
      setPaymentMethod(initialData.paymentMethod || 'bank_transfer');
      setNotes(initialData.notes || '');
      setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
    } else {
      setTitle('');
      setAmount(0);
      setFrequency('monthly');
      setCustomDays(undefined);
      setStartDate(new Date());
      setEndDate(undefined);
      setIsAutoPaid(false);
      setPaymentMethod('bank_transfer');
      setNotes('');
      setIsActive(true);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier' : 'Créer'} une dépense récurrente</DialogTitle>
          <DialogDescription>
            Enregistrez des dépenses qui se répètent automatiquement selon une fréquence définie
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la dépense</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Loyer bureau"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Fréquence</Label>
              <Select value={frequency} onValueChange={(value) => setFrequency(value as RecurringExpense['frequency'])}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Sélectionnez une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="yearly">Annuel</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {frequency === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customDays">Jours d'intervalle</Label>
                <Input
                  id="customDays"
                  type="number"
                  min="1"
                  value={customDays}
                  onChange={(e) => setCustomDays(parseInt(e.target.value))}
                  required
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP', { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin (optionnel)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP', { locale: fr }) : "Aucune date de fin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="autoPaid"
                checked={isAutoPaid}
                onCheckedChange={setIsAutoPaid}
              />
              <Label htmlFor="autoPaid">Paiement automatique</Label>
            </div>
            
            {isAutoPaid && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Sélectionnez une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="card">Carte</SelectItem>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="check">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations supplémentaires..."
              className="resize-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Dépense active</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || amount <= 0 || !title.trim() || !startDate || (frequency === 'custom' && (!customDays || customDays <= 0))}
            >
              {isSubmitting ? 'Traitement...' : isEditing ? 'Mettre à jour' : 'Créer dépense récurrente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringExpenseDialog;
