
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTransactions, Transaction, mockLedgerEntries, mockBranches, Branch } from "@/models/transaction";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionLedgerDialog from "@/components/transactions/TransactionLedgerDialog";
import BackupDialog from "@/components/transactions/BackupDialog";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import TransactionHeader from "@/components/transactions/TransactionHeader";
import TransactionFormDialog from "@/components/transactions/TransactionFormDialog";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Create a type adapter function to convert Branch to Business
const adaptBranchToBusiness = (branch: Branch) => {
  return {
    ...branch,
    active: branch.status === "active",
    createdAt: new Date().toISOString(),
    // Adding other potentially missing Business properties
    logoUrl: undefined,
    description: branch.name,
    type: branch.type,
    country: undefined,
    currency: undefined,
    timezone: undefined
  };
};

const Transactions = () => {
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showLedgerPreview, setShowLedgerPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
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
  } = useTransactionOperations();
  
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

  // Convert Branch[] to Business[] for compatibility with TransactionFormDialog
  const businessBranches = mockBranches.map(adaptBranchToBusiness);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(mockTransactions);
      } catch (error) {
        toast.error("Failed to load transactions");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [setTransactions, setIsLoading]);
  
  const handleShowLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowLedgerPreview(true);
  };
  
  const handleBackupData = () => {
    setShowBackupDialog(true);
  };
  
  const generateBackupFile = (type: 'json' | 'sql') => {
    setTimeout(() => {
      setShowBackupDialog(false);
      toast.success(`Your ${type.toUpperCase()} backup is ready to download.`, {
        description: "Backup created successfully"
      });
    }, 1500);
  };
  
  const getLedgerEntries = (transactionId: string) => {
    return mockLedgerEntries.filter(entry => entry.transactionId === transactionId);
  };
  
  const handleSubmitTransaction = async (data: any) => {
    try {
      await handleCreateTransaction(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <TransactionHeader 
          isOfflineMode={isOfflineMode}
          isSyncing={isSyncing}
          onToggleOfflineMode={handleToggleOfflineMode}
          onBackupData={handleBackupData}
          onNewTransaction={() => setIsDialogOpen(true)}
          isLoading={isLoading}
        />
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View and manage all transactions
            </CardDescription>
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
              branches={mockBranches}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              <TransactionsList 
                transactions={filteredTransactions}
                onViewLedger={handleShowLedger}
                onChangeStatus={handleChangeStatus}
                onDeleteTransaction={handleDeleteTransaction}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No transactions found</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Transaction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <TransactionLedgerDialog 
        open={showLedgerPreview}
        onOpenChange={setShowLedgerPreview}
        transaction={selectedTransaction}
        ledgerEntries={selectedTransaction ? getLedgerEntries(selectedTransaction.id) : []}
      />
      
      <BackupDialog 
        open={showBackupDialog}
        onOpenChange={setShowBackupDialog}
        onBackupGenerate={generateBackupFile}
      />
      
      <TransactionFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitTransaction}
        isSubmitting={isSubmittingTransaction}
        branches={businessBranches}
      />
    </div>
  );
};

export default Transactions;
