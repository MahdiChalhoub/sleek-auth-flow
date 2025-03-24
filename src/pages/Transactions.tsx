
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, DownloadCloud } from "lucide-react";
import { toast } from "sonner";
import { mockTransactions, Transaction, mockLedgerEntries, mockBranches } from "@/models/transaction";
import { useToast } from "@/hooks/use-toast";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionLedgerDialog from "@/components/transactions/TransactionLedgerDialog";
import BackupDialog from "@/components/transactions/BackupDialog";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";

const Transactions = () => {
  const { toast: toastUI } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showLedgerPreview, setShowLedgerPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
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
  
  const handleChangeStatus = (transactionId: string, newStatus: "open" | "locked" | "verified" | "secure") => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
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
  
  const handleShowLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowLedgerPreview(true);
  };
  
  const handleToggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    
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
  };
  
  const getLedgerEntries = (transactionId: string) => {
    return mockLedgerEntries.filter(entry => entry.transactionId === transactionId);
  };
  
  const handleBackupData = () => {
    setShowBackupDialog(true);
  };
  
  const generateBackupFile = (type: 'json' | 'sql') => {
    setTimeout(() => {
      setShowBackupDialog(false);
      toastUI({
        title: "Backup Created Successfully",
        description: `Your ${type.toUpperCase()} backup is ready to download.`,
        variant: "default",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/home">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Transactions</h1>
            
            {isOfflineMode && (
              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                Offline Mode
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center mr-4">
              <span className="text-sm mr-2">Offline Mode</span>
              <Switch 
                checked={isOfflineMode} 
                onCheckedChange={handleToggleOfflineMode} 
              />
            </div>
            
            <Button variant="outline" onClick={handleBackupData} className="mr-2">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Backup
            </Button>
            
            <Button>
              New Transaction
            </Button>
          </div>
        </div>
        
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
            
            <TransactionsList 
              transactions={filteredTransactions}
              onViewLedger={handleShowLedger}
              onChangeStatus={handleChangeStatus}
              onDeleteTransaction={handleDeleteTransaction}
            />
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
    </div>
  );
};

export default Transactions;
