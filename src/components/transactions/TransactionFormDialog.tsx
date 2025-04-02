
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Business } from "@/models/interfaces/businessInterfaces";
import { PaymentMethod } from '@/models/transaction';

interface TransactionFormData {
  description?: string;
  amount?: number;
  paymentMethod?: PaymentMethod;
  branchId?: string;
}

export interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<boolean>;
  businesses: Business[];
  transaction?: {
    id: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    branchId?: string;
  };
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  businesses,
  transaction
}) => {
  // Form state
  const [description, setDescription] = useState(transaction?.description || "");
  const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(transaction?.paymentMethod || "cash");
  const [branchId, setBranchId] = useState(transaction?.branchId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
