
import { useState } from "react";
import { toast } from "sonner";
import { Transaction } from "@/models/transaction";
import { useToast } from "@/hooks/use-toast";
import { TransactionFormValues } from "@/components/transactions/TransactionFormDialog";

export function useTransactionOperations(initialTransactions: Transaction[] = []) {
  const { toast: toastUI } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  
  const handleChangeStatus = (transactionId: string, newStatus: "open" | "locked" | "verified" | "secure") => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === transactionId) {
        if (
          (transaction.status === "open" && newStatus !== "verified") || 
          (transaction.status === "locked" && newStatus !== "open") ||
          (transaction.status === "verified" && (newStatus === "secure" || newStatus === "locked"))
        ) {
          return {
            ...transaction,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            ...(newStatus === "locked" && { lockedAt: new Date().toISOString(), lockedBy: "Current User" }),
            ...(newStatus === "verified" && { verifiedAt: new Date().toISOString(), verifiedBy: "Current User" })
          };
        } else {
          toast.error(`Invalid status transition from ${transaction.status} to ${newStatus}`);
          return transaction;
        }
      }
      return transaction;
    }));
    
    toast.success(`Transaction status updated`, {
      description: `Transaction has been ${newStatus}`,
    });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
    
    toast.success("Transaction deleted", {
      description: "The transaction has been permanently deleted",
    });
  };
  
  const handleToggleOfflineMode = () => {
    setIsSyncing(true);
    
    setTimeout(() => {
      setIsOfflineMode(!isOfflineMode);
      setIsSyncing(false);
      
      if (!isOfflineMode) {
        toastUI({
          title: "Offline Mode Enabled",
          description: "Changes will be stored locally and synced when you're back online.",
          variant: "default",
        });
      } else {
        toastUI({
          title: "Online Mode Restored",
          description: "All changes have been synced to the server.",
          variant: "default",
        });
      }
    }, 1500);
  };
  
  const handleCreateTransaction = async (data: TransactionFormValues) => {
    setIsSubmittingTransaction(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newId = `txn-${Date.now().toString(36)}`;
      
      const newTransaction: Transaction = {
        id: newId,
        amount: data.amount, // Now correctly typed as a number through the zod transform
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Current User",
        description: data.description,
        paymentMethod: data.paymentMethod,
        branchId: data.branchId,
        journalEntries: []
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success("Transaction created successfully");
      
      return newTransaction;
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
      throw error;
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  return {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    isSyncing,
    isOfflineMode,
    isSubmittingTransaction,
    handleChangeStatus,
    handleDeleteTransaction,
    handleToggleOfflineMode,
    handleCreateTransaction
  };
}
