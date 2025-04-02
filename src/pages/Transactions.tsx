
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, Download, Upload, SearchIcon, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionHeader from "@/components/transactions/TransactionHeader";
import TransactionFormDialog from "@/components/transactions/TransactionFormDialog";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { Badge } from "@/components/ui/badge";
import { Transaction, Business, mockBranches } from "@/models/transaction";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionLedgerDialog from "@/components/transactions/TransactionLedgerDialog";
import BackupDialog from "@/components/transactions/BackupDialog";

const Transactions = () => {
  const {
    transactions,
    isLoading,
    isOfflineMode,
    isSyncing,
    handleChangeStatus,
    handleDeleteTransaction,
    handleToggleOfflineMode,
    handleCreateTransaction
  } = useTransactionOperations([]);
  
  // State for transaction dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLedgerDialogOpen, setIsLedgerDialogOpen] = useState(false);

  // Set up transaction filters
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
  
  // Load transactions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from an API here
        // For now, we'll just use the mock data
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter branches for the UI
  const branches: { id: string; name: string }[] = [...mockBranches].map(branch => ({
    id: branch.id,
    name: branch.name
  }));

  // Group transactions by date for the UI
  const groupedTransactions = filteredTransactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  // Handle opening transaction form dialog
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  // Handle viewing transaction details/ledger
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <TransactionHeader
        onAddTransaction={handleAddTransaction}
        onBackupOpen={() => setIsBackupOpen(true)}
        isOfflineMode={isOfflineMode}
        isSyncing={isSyncing}
        onToggleOfflineMode={handleToggleOfflineMode}
      />
      
      <div className="mt-6 grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch</label>
              <Select 
                value={branchFilter} 
                onValueChange={setBranchFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Direction</label>
              <Select 
                value={sortDirection} 
                onValueChange={(value) => setSortDirection(value as "asc" | "desc")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setBranchFilter("all");
                  setSortDirection("desc");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">
                Income
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 hover:bg-green-50">
                  {transactions.filter(t => t.type === 'income').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="expense">
                Expense
                <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 hover:bg-red-50">
                  {transactions.filter(t => t.type === 'expense').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Filter className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">No transactions found</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    No transactions match your current filters. Try adjusting your search or filters, or create a new transaction.
                  </p>
                  <Button onClick={handleAddTransaction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              ) : (
                <TransactionsList 
                  groupedTransactions={groupedTransactions}
                  onChangeStatus={handleChangeStatus}
                  onDeleteTransaction={handleDeleteTransaction}
                  onViewLedger={handleViewLedger}
                />
              )}
            </TabsContent>
            
            <TabsContent value="income">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : filteredTransactions.filter(t => t.type === 'income').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Download className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">No income transactions found</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    Try adjusting your search or filters, or create a new income transaction.
                  </p>
                  <Button onClick={handleAddTransaction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Income
                  </Button>
                </div>
              ) : (
                <TransactionsList 
                  groupedTransactions={
                    Object.entries(groupedTransactions).reduce<Record<string, Transaction[]>>((acc, [date, transactions]) => {
                      const filtered = transactions.filter(t => t.type === 'income');
                      if (filtered.length > 0) {
                        acc[date] = filtered;
                      }
                      return acc;
                    }, {})
                  }
                  onChangeStatus={handleChangeStatus}
                  onDeleteTransaction={handleDeleteTransaction}
                  onViewLedger={handleViewLedger}
                />
              )}
            </TabsContent>
            
            <TabsContent value="expense">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : filteredTransactions.filter(t => t.type === 'expense').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">No expense transactions found</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    Try adjusting your search or filters, or create a new expense transaction.
                  </p>
                  <Button onClick={handleAddTransaction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              ) : (
                <TransactionsList 
                  groupedTransactions={
                    Object.entries(groupedTransactions).reduce<Record<string, Transaction[]>>((acc, [date, transactions]) => {
                      const filtered = transactions.filter(t => t.type === 'expense');
                      if (filtered.length > 0) {
                        acc[date] = filtered;
                      }
                      return acc;
                    }, {})
                  }
                  onChangeStatus={handleChangeStatus}
                  onDeleteTransaction={handleDeleteTransaction}
                  onViewLedger={handleViewLedger}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Transaction Dialog */}
      {isFormOpen && (
        <TransactionFormDialog
          open={isFormOpen}
          onOpenChange={(open) => setIsFormOpen(open)}
          onSubmit={handleCreateTransaction}
          transaction={selectedTransaction}
          businesses={branches as unknown as Business[]}
        />
      )}
      
      {/* Backup Dialog */}
      <BackupDialog
        open={isBackupOpen}
        onOpenChange={setIsBackupOpen}
        transactions={transactions}
      />
      
      {/* View Transaction Ledger */}
      {selectedTransaction && isLedgerDialogOpen && (
        <TransactionLedgerDialog
          transaction={selectedTransaction}
          onClose={() => setIsLedgerDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Transactions;
