import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, TransactionStatus, Business } from '@/models/transaction';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionStatusBadge from '@/components/TransactionStatusBadge';
import TransactionFormDialog from '@/components/transactions/TransactionFormDialog';
import TransactionLedgerDialog from '@/components/transactions/TransactionLedgerDialog';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Transactions: React.FC = () => {
  // Auth context for permission checks
  const { hasPermission } = useAuth();
  
  // Transaction management hooks
  const { 
    transactions, 
    isLoading, 
    createTransaction, 
    changeStatus,
    deleteTransaction 
  } = useTransactions();
  
  // Component state
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isLedgerDialogOpen, setIsLedgerDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Sample businesses for the dropdown in the form
  const businesses: Business[] = [
    { id: 'branch-1', name: 'Main Store', active: true, createdAt: new Date().toISOString() },
    { id: 'branch-2', name: 'Warehouse', active: true, createdAt: new Date().toISOString() },
    { id: 'branch-3', name: 'Downtown Location', active: true, createdAt: new Date().toISOString() }
  ];
  
  // Handle creating a new transaction
  const addTransaction = async (data: TransactionFormData): Promise<boolean> => {
    try {
      setIsSyncing(true);
      
      if (!data.amount || !data.description) {
        toast.error('Amount and description are required');
        return false;
      }
      
      await createTransaction({
        amount: data.amount,
        description: data.description,
        type: 'expense',
        status: 'open',
        paymentMethod: data.paymentMethod || 'cash',
        branchId: data.branchId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        journalEntries: []
      });
      
      toast.success('Transaction created successfully');
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Handle view ledger
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerDialogOpen(true);
  };
  
  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
    return transactions.reduce((groups, transaction) => {
      // Format date as YYYY-MM-DD
      const date = transaction.createdAt.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  };
  
  // Filter transactions by status
  const getFilteredTransactions = (): Transaction[] => {
    if (filterStatus === 'all') {
      return transactions;
    }
    return transactions.filter(transaction => transaction.status === filterStatus);
  };
  
  // Group transactions
  const groupedTransactions = groupTransactionsByDate(getFilteredTransactions());
  
  // Toggle offline mode
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    toast.info(`Switched to ${!isOfflineMode ? 'offline' : 'online'} mode`);
  };
  
  // Handle backup/sync
  const handleBackupOpen = () => {
    setIsBackupDialogOpen(true);
  };
  
  // Handle transaction status change
  const handleChangeStatus = (transactionId: string, newStatus: TransactionStatus) => {
    changeStatus(transactionId, newStatus);
  };
  
  // Handle transaction deletion
  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  return (
    <div className="container mx-auto p-6">
      <TransactionHeader 
        onNewTransaction={() => setIsFormDialogOpen(true)}
        onBackupOpen={handleBackupOpen}
        isOfflineMode={isOfflineMode}
        isSyncing={isSyncing}
        onToggleOfflineMode={toggleOfflineMode}
      />
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setFilterStatus}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="secure">Secure</TabsTrigger>
            </TabsList>
            
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : Object.keys(groupedTransactions).length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No transactions found.</p>
                  <Button 
                    onClick={() => setIsFormDialogOpen(true)} 
                    className="mt-4"
                    disabled={!hasPermission('can_create_transactions')}
                  >
                    Create Transaction
                  </Button>
                </div>
              ) : (
                Object.entries(groupedTransactions)
                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                  .map(([date, transactionsForDate]) => (
                    <div key={date} className="space-y-2">
                      <h3 className="font-medium">{format(new Date(date), 'PPP')}</h3>
                      <div className="space-y-2">
                        {transactionsForDate.map(transaction => (
                          <div 
                            key={transaction.id} 
                            className="p-4 border rounded-md group hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{transaction.description}</h4>
                                  <TransactionStatusBadge status={transaction.status} />
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {format(new Date(transaction.createdAt), 'h:mm a')} • 
                                  {transaction.type} • 
                                  {transaction.paymentMethod}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
                                <div className="flex">
                                  <button 
                                    onClick={() => handleViewLedger(transaction)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Transaction Form Dialog */}
      {isFormDialogOpen && (
        <TransactionFormDialog
          isOpen={isFormDialogOpen}
          onOpenChange={setIsFormDialogOpen}
          onSubmit={addTransaction}
          businesses={businesses}
        />
      )}
      
      {/* Transaction Ledger Dialog */}
      {isLedgerDialogOpen && selectedTransaction && (
        <TransactionLedgerDialog
          isOpen={isLedgerDialogOpen}
          onClose={() => setIsLedgerDialogOpen(false)}
          transaction={selectedTransaction}
        />
      )}
      
      {/* Backup Dialog */}
      {isBackupDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Backup & Sync</h2>
            <p className="mb-4">This will synchronize your local transactions with the server.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                toast.success('Sync completed successfully');
                setIsBackupDialogOpen(false);
              }}>Sync Now</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
