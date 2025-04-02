import React from 'react';
import { PaymentMethod } from '@/models/transaction';

interface TransactionFormData {
  description?: string;
  amount?: number;
  paymentMethod?: PaymentMethod;
  branchId?: string;
}

export interface TransactionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  businesses: Business[];
  transaction?: Transaction;
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  businesses,
  transaction
}) => {
  // Form state
  const [description, setDescription] = React.useState(transaction?.description || "");
  const [amount, setAmount] = React.useState(transaction?.amount.toString() || "");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(transaction?.paymentMethod || "cash");
  const [branchId, setBranchId] = React.useState(transaction?.branchId || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form validation
  const isValid = description.trim() !== "" && amount !== "" && parseFloat(amount) > 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        description,
        amount: parseFloat(amount),
        paymentMethod,
        branchId: branchId || undefined
      });
      
      // Reset form
      setDescription("");
      setAmount("");
      setPaymentMethod("cash");
      setBranchId("");
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error("Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="mobile">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="branchId">Branch</Label>
            <Select
              value={branchId}
              onValueChange={(value) => setBranchId(value)}
            >
              <SelectTrigger id="branchId">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific branch</SelectItem>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : transaction ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
