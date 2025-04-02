import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";

import TransactionHeader from "@/components/transactions/TransactionHeader";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionFormDialog from "@/components/transactions/TransactionFormDialog";
import TransactionLedgerDialog from "@/components/transactions/TransactionLedgerDialog";
import BackupDialog from "@/components/transactions/BackupDialog";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { Transaction, mockBranches, Business } from "@/models/transaction";
import { transactionAPI } from "@/hooks/transactionAPI";
import { toast } from 'sonner';

const TransactionsPage: React.FC = () => {
  // State hooks
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isLedgerDialogOpen, setIsLedgerDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use transaction operations hook
  const { 
    transactions, 
    setTransactions,
    isSyncing, 
    isOfflineMode,
    isSubmittingTransaction,
    handleChangeStatus,
    handleDeleteTransaction,
    handleToggleOfflineMode,
    handleCreateTransaction
  } = useTransactionOperations();

  // Load transactions on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await transactionAPI.getAll();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [setTransactions]);

  // Handle view ledger
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerDialogOpen(true);
  };

  // Group transactions by date for display
  const groupTransactionsByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
    const grouped: Record<string, Transaction[]> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(transaction);
    });
    
    return grouped;
  };

  // Filter transactions by different criteria
  const pendingTransactions = transactions.filter(t => t.status === 'open' || t.status === 'pending');
  const lockedTransactions = transactions.filter(t => t.status === 'locked');
  const verifiedTransactions = transactions.filter(t => t.status === 'verified' || t.status === 'secure');
  
  const groupedPendingTransactions = groupTransactionsByDate(pendingTransactions);
  const groupedLockedTransactions = groupTransactionsByDate(lockedTransactions);
  const groupedVerifiedTransactions = groupTransactionsByDate(verifiedTransactions);

  // Create a list of businesses from mockBranches for the TransactionFormDialog
  // Convert to mutable type to address the readonly error
  const businesses: Business[] = [...mockBranches].map(branch => ({
    id: branch.id,
    name: branch.name,
    active: true,
    createdAt: new Date().toISOString()
  }));

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* Transaction Header */}
      <TransactionHeader 
        onNewTransaction={() => setIsTransactionFormOpen(true)}
        onBackupOpen={() => setIsBackupDialogOpen(true)}
        isOfflineMode={isOfflineMode}
        isSyncing={isSyncing}
        onToggleOfflineMode={handleToggleOfflineMode}
      />
      
      {/* Transaction Stats Cards */}
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Transactions awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Locked Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lockedTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Transactions pending verification
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Completed verification process
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions List */}
      <div className="mt-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending <span className="ml-1 text-xs">({pendingTransactions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked <span className="ml-1 text-xs">({lockedTransactions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified <span className="ml-1 text-xs">({verifiedTransactions.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pending Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-6 w-32 bg-muted rounded mb-4"></div>
                      <div className="text-sm text-muted-foreground">Loading transactions...</div>
                    </div>
                  </div>
                ) : pendingTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending transactions found</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsTransactionFormOpen(true)}
                    >
                      Create new transaction
                    </Button>
                  </div>
                ) : (
                  <TransactionsList
                    transactions={pendingTransactions}
                    onChangeStatus={handleChangeStatus}
                    onDeleteTransaction={handleDeleteTransaction}
                    onViewLedger={handleViewLedger}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="locked" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Locked Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-6 w-32 bg-muted rounded mb-4"></div>
                      <div className="text-sm text-muted-foreground">Loading transactions...</div>
                    </div>
                  </div>
                ) : lockedTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No locked transactions found</p>
                  </div>
                ) : (
                  <TransactionsList
                    transactions={lockedTransactions}
                    onChangeStatus={handleChangeStatus}
                    onDeleteTransaction={handleDeleteTransaction}
                    onViewLedger={handleViewLedger}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verified" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Verified Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-6 w-32 bg-muted rounded mb-4"></div>
                      <div className="text-sm text-muted-foreground">Loading transactions...</div>
                    </div>
                  </div>
                ) : verifiedTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No verified transactions found</p>
                  </div>
                ) : (
                  <TransactionsList
                    transactions={verifiedTransactions}
                    onChangeStatus={handleChangeStatus}
                    onDeleteTransaction={handleDeleteTransaction}
                    onViewLedger={handleViewLedger}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Transaction Form Dialog */}
      {isTransactionFormOpen && (
        <TransactionFormDialog
          isOpen={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSubmit={handleCreateTransaction}
          isSubmitting={isSubmittingTransaction}
          branches={businesses}
        />
      )}
      
      {/* Transaction Ledger Dialog */}
      {isLedgerDialogOpen && selectedTransaction && (
        <TransactionLedgerDialog
          transaction={selectedTransaction}
          onClose={() => setIsLedgerDialogOpen(false)}
        />
      )}
      
      {/* Backup Dialog */}
      {isBackupDialogOpen && (
        <BackupDialog
          isOpen={isBackupDialogOpen}
          onOpenChange={setIsBackupDialogOpen}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
