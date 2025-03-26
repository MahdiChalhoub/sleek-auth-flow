
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethod } from "@/models/payment";
import { Expense, getRemainingBalance } from "@/models/expense";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { fr } from "date-fns/locale";

interface ExpensePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense;
  onAddPayment: (data: {
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    notes?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const ExpensePaymentDialog: React.FC<ExpensePaymentDialogProps> = ({
  open,
  onOpenChange,
  expense,
  onAddPayment,
  isSubmitting,
}) => {
  const [amount, setAmount] = React.useState<number>(getRemainingBalance(expense));
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = React.useState<Date>(new Date());
  const [notes, setNotes] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setAmount(getRemainingBalance(expense));
      setPaymentMethod("cash");
      setPaymentDate(new Date());
      setNotes("");
    }
  }, [open, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddPayment({
      amount,
      paymentMethod,
      paymentDate: paymentDate.toISOString(),
      notes: notes.trim() || undefined,
    });
  };

  const remainingBalance = getRemainingBalance(expense);
  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(expense.amount);

  const formattedRemainingBalance = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(remainingBalance);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un paiement</DialogTitle>
          <DialogDescription>
            Enregistrer un paiement pour cette dépense.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Card className="bg-muted/40">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dépense</p>
                    <p className="font-medium">{expense.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Montant total</p>
                    <p className="font-medium">{formattedAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Solde restant</p>
                    <p className="font-medium">{formattedRemainingBalance}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date d'échéance</p>
                    <p className="font-medium">{format(new Date(expense.dueDate), "P", { locale: fr })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Montant du paiement
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                min={0.01}
                max={remainingBalance}
              />
              {amount > remainingBalance && (
                <p className="text-sm text-destructive">
                  Le montant ne peut pas dépasser le solde restant.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="payment-method" className="text-sm font-medium">
                Méthode de paiement
              </label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Date de paiement</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !paymentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paymentDate ? format(paymentDate, "P", { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(date) => setPaymentDate(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (optionnel)
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Détails supplémentaires sur ce paiement"
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || amount <= 0 || amount > remainingBalance}>
              {isSubmitting ? "Traitement..." : "Enregistrer le paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpensePaymentDialog;
