import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, TransactionStatus } from '@/models/transaction';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFinancialYears } from '@/hooks/useFinancialYears';
import TransactionFormModal from '@/components/transactions/TransactionFormModal';
import { format } from 'date-fns';

const TransactionsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { transactions } = useTransactions();
  const { currentFinancialYear } = useFinancialYears();

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsCreateModalOpen(true);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="font-medium">{row.original.id.substring(0, 8)}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'PPP'),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={handleCreateTransaction}>
          <Plus className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                incomeTransactions.reduce((sum, t) => sum + t.amount, 0) -
                expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                Showing all transactions for {currentFinancialYear?.name || 'current financial year'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Transactions</CardTitle>
              <CardDescription>
                Showing income transactions for {currentFinancialYear?.name || 'current financial year'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={incomeTransactions} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expense">
          <Card>
            <CardHeader>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>
                Showing expense transactions for {currentFinancialYear?.name || 'current financial year'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={expenseTransactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isCreateModalOpen && (
        <TransactionFormModal
          transaction={selectedTransaction}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
