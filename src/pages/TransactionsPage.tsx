import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { TransactionFormDialog } from '@/components/transactions/TransactionFormDialog';
import { TransactionLedgerDialog } from '@/components/transactions/TransactionLedgerDialog';
import { Transaction, TransactionFormData } from '@/models/interfaces/transactionInterfaces';

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sale',
    amount: 250.50,
    status: 'open',
    notes: 'Daily sales revenue',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'expense',
    amount: 75.20,
    status: 'closed',
    notes: 'Office supplies',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    type: 'refund',
    amount: 45.00,
    status: 'reconciled',
    notes: 'Customer refund - damaged product',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [ledgerDialogOpen, setLedgerDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showTransactionFormDialog, setShowTransactionFormDialog] = useState(false);
  const [showLedgerDialog, setShowLedgerDialog] = useState(false);
  const [businesses, setBusinesses] = useState([]); // Add businesses state

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab !== 'all' && transaction.type !== activeTab) {
      return false;
    }
    
    if (searchTerm) {
      return (
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  const handleCreateTransaction = async (data: TransactionFormData): Promise<boolean> => {
    if (!data.type || !data.amount) {
      toast.error('Transaction type and amount are required');
      return false;
    }
    
    try {
      // In a real app, you would call your API here
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: data.type,
        amount: data.amount,
        status: 'open',
        notes: data.description,
        created_at: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transaction created successfully');
      return true;
    } catch (error) {
      toast.error('Failed to create transaction');
      console.error('Error creating transaction:', error);
      return false;
    }
  };

  const viewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setLedgerDialogOpen(true);
  };

  const renderTransactionFormDialog = () => {
    if (!showTransactionFormDialog) return null;
    
    return (
      <TransactionFormDialog
        open={showTransactionFormDialog}
        onOpenChange={setShowTransactionFormDialog}
        onSubmit={handleCreateTransaction}
        businesses={businesses} // Add the missing businesses prop
      />
    );
  };

  const renderTransactionLedgerDialog = () => {
    if (!selectedTransaction) return null;
    
    return (
      <TransactionLedgerDialog
        open={showLedgerDialog} // Change isOpen to open
        onOpenChange={setShowLedgerDialog}
        transaction={selectedTransaction}
      />
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage financial transactions and payments</p>
        </div>
        <Button onClick={() => setTransactionDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab('all')}>
                    All Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('sale')}>
                    Sales
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('expense')}>
                    Expenses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('refund')}>
                    Refunds
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sale">Sales</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="m-0">
              <Card className="border-0 shadow-none">
                <ScrollArea className="h-[calc(100vh-320px)] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Date
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Loading transactions...
                          </TableCell>
                        </TableRow>
                      ) : filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow 
                            key={transaction.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => viewTransactionDetails(transaction)}
                          >
                            <TableCell className="font-medium">
                              {transaction.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>
                              {formatDate(transaction.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  transaction.type === 'sale' ? 'default' :
                                  transaction.type === 'expense' ? 'destructive' :
                                  'secondary'
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  transaction.status === 'open' ? 'outline' :
                                  transaction.status === 'reconciled' ? 'success' :
                                  'secondary'
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {transaction.notes || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewTransactionDetails(transaction);
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Transaction Form Dialog */}
      {renderTransactionFormDialog()}
      
      {/* Transaction Ledger Dialog */}
      {renderTransactionLedgerDialog()}
    </div>
  );
}
