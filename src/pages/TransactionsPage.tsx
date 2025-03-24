
import React, { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import { TransactionLedgerDialog } from "@/components/transactions/TransactionLedgerDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Transaction } from "@/models/transaction";

const TransactionsPage = () => {
  const { transactions, isLoading, changeStatus, deleteTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerOpen(true);
  };
  
  const handleChangeStatus = (transactionId: string, newStatus: "open" | "locked" | "verified" | "secure") => {
    changeStatus({ transactionId, newStatus });
  };
  
  const handleDeleteTransaction = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters />
          
          <div className="mt-6">
            <TransactionsList 
              transactions={transactions}
              onViewLedger={handleViewLedger}
              onChangeStatus={handleChangeStatus}
              onDeleteTransaction={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
      
      {selectedTransaction && (
        <TransactionLedgerDialog 
          isOpen={isLedgerOpen}
          onOpenChange={setIsLedgerOpen}
          transaction={selectedTransaction}
        />
      )}
      
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionsPage;
