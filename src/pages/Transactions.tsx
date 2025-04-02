import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download } from 'lucide-react';
import { TransactionFormDialog } from '@/components/transactions/TransactionFormDialog';
import { TransactionLedgerDialog } from '@/components/transactions/TransactionLedgerDialog';
import { toast } from 'sonner';
import { Transaction, TransactionFormData } from '@/models/interfaces/transactionInterfaces';
import { Business } from '@/models/interfaces/businessInterfaces';

// Mock business data
const mockBusinesses: Business[] = [
  { id: 'biz1', name: 'Main Store', active: true, createdAt: new Date().toISOString() },
  { id: 'biz2', name: 'Branch Location', active: true, createdAt: new Date().toISOString() }
];

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: 'tr001',
    type: 'sale',
    amount: 249.99,
    status: 'open',
    created_at: '2023-05-15T09:30:00Z'
  },
  {
    id: 'tr002',
    type: 'expense',
    amount: 125.50,
    status: 'closed',
    notes: 'Office supplies',
    created_at: '2023-05-14T14:15:00Z'
  },
  {
    id: 'tr003',
    type: 'refund',
    amount: 49.99,
    status: 'open',
    notes: 'Customer return',
    created_at: '2023-05-13T10:45:00Z'
  }
];

const Transactions: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  
  const handleCreateTransaction = async (data: TransactionFormData): Promise<boolean> => {
    try {
      // Simulate creating a transaction
      const newTransaction: Transaction = {
        id: `tr${Math.floor(Math.random() * 1000)}`,
        type: data.type || 'sale',
        amount: data.amount || 0,
        status: 'open',
        notes: data.notes,
        created_at: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success('Transaction created', {
        description: `Transaction of $${data.amount} has been recorded.`
      });
      
      return true;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction');
      return false;
    }
  };
  
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerOpen(true);
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const renderTypeLabel = (type: string) => {
    const typeMappings: Record<string, { label: string, className: string }> = {
      'sale': { label: 'Sale', className: 'bg-green-100 text-green-800' },
      'expense': { label: 'Expense', className: 'bg-red-100 text-red-800' },
      'refund': { label: 'Refund', className: 'bg-amber-100 text-amber-800' },
      'transfer': { label: 'Transfer', className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = typeMappings[type] || { label: 'Other', className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };
  
  const renderStatusDot = (status: string) => {
    const statusColors: Record<string, string> = {
      'open': 'bg-green-500',
      'closed': 'bg-blue-500',
      'reconciled': 'bg-purple-500'
    };
    
    return (
      <span className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2 ${statusColors[status] || 'bg-gray-500'}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">ID</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Type</th>
                  <th className="py-3 px-4 text-left font-medium">Amount</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Notes</th>
                  <th className="py-3 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-t border-muted/20 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{transaction.id}</td>
                    <td className="py-3 px-4">{formatDate(transaction.created_at)}</td>
                    <td className="py-3 px-4">{renderTypeLabel(transaction.type)}</td>
                    <td className="py-3 px-4">{formatAmount(transaction.amount)}</td>
                    <td className="py-3 px-4">{renderStatusDot(transaction.status)}</td>
                    <td className="py-3 px-4 truncate max-w-[200px]">{transaction.notes || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewLedger(transaction)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <TransactionFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateTransaction}
        businesses={mockBusinesses}
      />
      
      {selectedTransaction && (
        <TransactionLedgerDialog
          open={isLedgerOpen}
          onOpenChange={setIsLedgerOpen}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;
