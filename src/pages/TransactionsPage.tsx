
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs-redesigned';
import { 
  Transaction,
  TransactionType,
  TransactionStatus
} from '@/models/transaction';
import { format } from 'date-fns';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionsList from '@/components/transactions/TransactionsList';
import { TransactionFormDialog } from '@/components/transactions/TransactionFormDialog';
import { TransactionLedgerDialog } from '@/components/transactions/TransactionLedgerDialog';
import BackupDialog from '@/components/transactions/BackupDialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Mock transaction data for development
const transactionsMock: Transaction[] = [
  {
    id: 'tx1',
    amount: 250.00,
    description: 'Office supplies purchase',
    paymentMethod: 'card',
    branchId: 'branch-1',
    status: 'open',
    type: 'expense',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T10:30:00Z',
    createdBy: 'John Doe',
    journalEntries: []
  },
  {
    id: 'tx2',
    amount: 1250.50,
    description: 'Client payment - Invoice #4502',
    paymentMethod: 'bank',
    branchId: 'branch-2',
    status: 'verified',
    type: 'sale',
    createdAt: '2023-06-14T09:15:00Z',
    updatedAt: '2023-06-14T15:45:00Z',
    createdBy: 'Jane Smith',
    journalEntries: []
  },
  {
    id: 'tx3',
    amount: 300.00,
    description: 'Cash transfer to main branch',
    paymentMethod: 'cash',
    branchId: 'branch-3',
    status: 'locked',
    type: 'transfer',
    createdAt: '2023-06-13T16:20:00Z',
    updatedAt: '2023-06-13T16:20:00Z',
    createdBy: 'Mike Johnson',
    journalEntries: []
  }
];

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
  
  const { hasPermission } = useAuth();
  
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
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
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
        </TabsContent>
        
        <TabsContent value="sales">
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
        </TabsContent>
        
        <TabsContent value="expenses">
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
        </TabsContent>
        
        <TabsContent value="transfers">
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
        </TabsContent>
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
          isOpen={isLedgerDialogOpen}
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
