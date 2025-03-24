
import React, { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionLedgerDialog from "@/components/transactions/TransactionLedgerDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Transaction, TransactionStatus } from "@/models/transaction";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";

const TransactionsPage = () => {
  const { transactions, isLoading, changeStatus, deleteTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Using the transaction filters hook
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortDirection,
    setSortDirection,
    branchFilter,
    setBranchFilter,
    filteredTransactions
  } = useTransactionFilters(transactions);
  
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerOpen(true);
  };
  
  const handleChangeStatus = (transactionId: string, newStatus: TransactionStatus) => {
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
          <TransactionFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            branches={[]} // Pass an empty array as a placeholder for branches
          />
          
          <div className="mt-6">
            <TransactionsList 
              transactions={filteredTransactions || transactions}
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
          open={isLedgerOpen}
          onOpenChange={setIsLedgerOpen}
          transaction={selectedTransaction}
          ledgerEntries={selectedTransaction.journalEntries || []}
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
