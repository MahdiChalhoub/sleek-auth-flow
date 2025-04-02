
import React, { useState, useEffect } from 'react';
import { 
  Tab, 
  TabContent, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs 
} from '@/components/ui/tabs-redesigned';
import { 
  Transaction,
  TransactionType,
  TransactionStatus
} from '@/models/transaction';
import { transactionsMock } from '@/models/mockData/transactionMockData';
import { format } from 'date-fns';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionsList from '@/components/transactions/TransactionsList';
import TransactionFormDialog from '@/components/transactions/TransactionFormDialog';
import TransactionLedgerDialog from '@/components/transactions/TransactionLedgerDialog';
import BackupDialog from '@/components/transactions/BackupDialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isLedgerDialogOpen, setIsLedgerDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { permissions } = useAuth();
  
  // Simulate loading transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load mock data
        setTransactions(transactionsMock);
        setLoading(false);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error('Failed to load transactions');
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, []);
  
  // Filter transactions by type
  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter(tx => tx.type === type);
  };
  
  // Handle transaction status change
  const handleStatusChange = (transactionId: string, newStatus: TransactionStatus) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === transactionId ? { ...tx, status: newStatus } : tx
      )
    );
    
    toast.success(`Transaction status updated to ${newStatus}`);
  };
  
  // Handle transaction delete
  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== transactionId));
    toast.success('Transaction deleted successfully');
  };
  
  // Handle view ledger
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerDialogOpen(true);
  };
  
  // Handle form submit
  const handleFormSubmit = async (data: {
    description?: string;
    amount?: number;
    paymentMethod?: 'cash' | 'card' | 'bank' | 'wave' | 'mobile' | 'not_specified';
    branchId?: string;
  }) => {
    // Simulate creating a new transaction
    const newTransaction: Transaction = {
      id: `tx${Math.random().toString(36).substring(2, 9)}`,
      amount: data.amount || 0,
      description: data.description || 'New Transaction',
      paymentMethod: data.paymentMethod || 'cash',
      branchId: data.branchId,
      status: 'open',
      type: 'expense',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      journalEntries: []
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormDialogOpen(false);
    toast.success('Transaction created successfully');
    
    return true;
  };
  
  // Handle toggle offline mode
  const handleToggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
    toast.info(`Switched to ${!isOfflineMode ? 'offline' : 'online'} mode`);
  };
  
  // Create business array for the dropdown
  const businesses: Business[] = [
    { id: 'branch-1', name: 'Main Store', active: true, createdAt: new Date().toISOString() },
    { id: 'branch-2', name: 'Warehouse', active: true, createdAt: new Date().toISOString() },
    { id: 'branch-3', name: 'Downtown Location', active: true, createdAt: new Date().toISOString() }
  ];
  
  return (
    <div className="space-y-6">
      <TransactionHeader 
        onNewTransaction={() => setIsFormDialogOpen(true)}
        onBackupOpen={() => setIsBackupDialogOpen(true)}
        isOfflineMode={isOfflineMode}
        isSyncing={isSyncing}
        onToggleOfflineMode={handleToggleOfflineMode}
      />
      
      <Tabs defaultValue="all">
        <TabList className="mb-6">
          <Tab value="all">All Transactions</Tab>
          <Tab value="sales">Sales</Tab>
          <Tab value="expenses">Expenses</Tab>
          <Tab value="transfers">Transfers</Tab>
        </TabList>
        
        <TabPanels>
          {/* All Transactions */}
          <TabPanel value="all">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-2">No transactions found</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Create your first transaction by clicking the "New Transaction" button above.
                </p>
              </div>
            ) : (
              <TransactionsList 
                transactions={transactions}
                onChangeStatus={handleStatusChange}
                onDeleteTransaction={handleDeleteTransaction}
                onViewLedger={handleViewLedger}
              />
            )}
          </TabPanel>
          
          {/* Sales Transactions */}
          <TabPanel value="sales">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : getTransactionsByType('sale').length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-2">No sales transactions found</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Create your first sales transaction by clicking the "New Transaction" button above.
                </p>
              </div>
            ) : (
              <TransactionsList 
                transactions={getTransactionsByType('sale')}
                onChangeStatus={handleStatusChange}
                onDeleteTransaction={handleDeleteTransaction}
                onViewLedger={handleViewLedger}
              />
            )}
          </TabPanel>
          
          {/* Expenses Transactions */}
          <TabPanel value="expenses">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : getTransactionsByType('expense').length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-2">No expense transactions found</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Create your first expense transaction by clicking the "New Transaction" button above.
                </p>
              </div>
            ) : (
              <TransactionsList 
                transactions={getTransactionsByType('expense')}
                onChangeStatus={handleStatusChange}
                onDeleteTransaction={handleDeleteTransaction}
                onViewLedger={handleViewLedger}
              />
            )}
          </TabPanel>
          
          {/* Transfers Transactions */}
          <TabPanel value="transfers">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : getTransactionsByType('transfer').length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-2">No transfer transactions found</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Create your first transfer transaction by clicking the "New Transaction" button above.
                </p>
              </div>
            ) : (
              <TransactionsList 
                transactions={getTransactionsByType('transfer')}
                onChangeStatus={handleStatusChange}
                onDeleteTransaction={handleDeleteTransaction}
                onViewLedger={handleViewLedger}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Transaction Form Dialog */}
      {isFormDialogOpen && (
        <TransactionFormDialog
          open={isFormDialogOpen}
          onOpenChange={setIsFormDialogOpen}
          onSubmit={handleFormSubmit}
          businesses={businesses}
        />
      )}
      
      {/* Transaction Ledger Dialog */}
      {isLedgerDialogOpen && selectedTransaction && (
        <TransactionLedgerDialog 
          open={isLedgerDialogOpen}
          onOpenChange={setIsLedgerDialogOpen}
          transaction={selectedTransaction}
        />
      )}
      
      {/* Backup Dialog */}
      <BackupDialog 
        open={isBackupDialogOpen}
        onOpenChange={setIsBackupDialogOpen}
        transactions={transactions}
      />
    </div>
  );
};

export default TransactionsPage;
