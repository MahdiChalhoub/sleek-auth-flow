
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionStatusBadge } from '@/components/TransactionStatusBadge';
import { ArrowLeft, Filter, Plus, Search, X } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { Transaction, mockBranches } from '@/models/transaction';
import TransactionFormModal from '@/components/transactions/TransactionFormModal';
import TransactionLedgerDialog from '@/components/transactions/TransactionLedgerDialog';
import { getFormattedDate, getFormattedDateTime } from '@/utils/formatters';

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { transactions, isLoading, error, changeStatus, deleteTransaction } = useTransactions();
  const { filters, setFilter, clearFilter, filteredTransactions } = useTransactionFilters(transactions);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  // Convert the readonly array to mutable for props
  const branches = [...mockBranches].map(branch => ({ 
    id: branch.id, 
    name: branch.name 
  }));

  // View a transaction's ledger entries
  const handleViewLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLedgerOpen(true);
  };

  // Edit a transaction
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Create a new transaction
  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  // Update transaction status
  const handleStatusChange = async (id: string, newStatus: any) => {
    await changeStatus(id, newStatus);
  };

  // Delete a transaction
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  // Close modal and refresh data
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Close ledger dialog
  const handleLedgerClose = () => {
    setIsLedgerOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/home">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Transactions</h1>
        </div>
        <Button onClick={handleCreateTransaction}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={filters.search || ''}
                onChange={(e) => setFilter('search', e.target.value)}
              />
            </div>
            
            <div className="flex flex-row gap-2">
              <div>
                <Label htmlFor="status-filter" className="sr-only">Status</Label>
                <select 
                  id="status-filter"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filters.status || ''}
                  onChange={(e) => setFilter('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="locked">Locked</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <Label htmlFor="type-filter" className="sr-only">Type</Label>
                <select 
                  id="type-filter"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filters.type || ''}
                  onChange={(e) => setFilter('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>
              {(filters.search || filters.status || filters.type) && (
                <Button variant="ghost" size="icon" onClick={() => clearFilter()} className="h-10 w-10">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No transactions found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">
                        {transaction.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{getFormattedDate(transaction.createdAt)}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'income' ? 'success' : transaction.type === 'expense' ? 'destructive' : 'outline'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={transaction.type === 'income' ? 'text-green-600' : transaction.type === 'expense' ? 'text-red-600' : ''}>
                        {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                        {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <TransactionStatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewLedger(transaction)}>
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditTransaction(transaction)}>
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Form Modal */}
      {isModalOpen && (
        <TransactionFormModal
          transaction={selectedTransaction}
          branches={branches}
          onClose={handleModalClose}
        />
      )}

      {/* Ledger Dialog */}
      {isLedgerOpen && selectedTransaction && (
        <TransactionLedgerDialog
          transaction={selectedTransaction}
          onClose={handleLedgerClose}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
