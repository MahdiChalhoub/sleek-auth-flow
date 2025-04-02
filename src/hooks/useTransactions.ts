
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus, TransactionType } from '@/models/transaction';
import { toast } from 'sonner';
import { useFinancialYears } from './useFinancialYears';

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    type: "sale",
    amount: 125.99,
    status: "verified",
    description: "Sale of inventory items",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    financialYearId: "fy-2023"
  },
  {
    id: "tx-002",
    type: "expense",
    amount: 45.50,
    status: "open",
    description: "Office supplies",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    financialYearId: "fy-2023"
  },
  {
    id: "tx-003",
    type: "transfer",
    amount: 500.00,
    status: "locked",
    description: "Transfer between accounts",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    financialYearId: "fy-2023"
  }
];

// Mock implementation of the transactions API
const transactionsApi = {
  getAll: () => Promise.resolve(mockTransactions),
  getById: (id: string) => Promise.resolve(mockTransactions.find(t => t.id === id) || null),
  create: (data: Omit<Transaction, 'id'>) => {
    const id = `tx-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    const newTransaction = { ...data, id };
    return Promise.resolve(newTransaction);
  },
  update: (id: string, data: Partial<Transaction>) => {
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) return Promise.reject(new Error('Transaction not found'));
    const updated = { ...transaction, ...data };
    return Promise.resolve(updated);
  },
  updateStatus: (id: string, status: TransactionStatus) => {
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) return Promise.reject(new Error('Transaction not found'));
    const updated = { ...transaction, status };
    return Promise.resolve(updated);
  },
  delete: (id: string) => {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) return Promise.reject(new Error('Transaction not found'));
    return Promise.resolve(true);
  }
};

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const { currentFinancialYear } = useFinancialYears();
  
  // Fetch all transactions
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll()
  });
  
  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transactionData: Omit<Transaction, 'id'>) => {
      // If financial year is not provided, use the current financial year
      const financialYearId = transactionData.financialYearId || currentFinancialYear?.id;
      
      if (!financialYearId) {
        throw new Error('No active financial year. Cannot create transaction without a financial year.');
      }
      
      // Ensure we have createdAt and updatedAt and required fields
      const now = new Date().toISOString();
      const completeData: Omit<Transaction, 'id'> = {
        ...transactionData,
        type: transactionData.type || 'expense', // Default type
        financialYearId,
        createdAt: transactionData.createdAt || now,
        updatedAt: transactionData.updatedAt || now
      };
      
      return transactionsApi.create(completeData);
    },
    onSuccess: () => {
      toast.success('Transaction created successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create transaction: ${error.message}`);
    }
  });

  // Change transaction status mutation
  const changeStatus = useMutation({
    mutationFn: (params: { id: string, status: TransactionStatus }) => 
      transactionsApi.updateStatus(params.id, params.status),
    onSuccess: () => {
      toast.success('Transaction status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update transaction status: ${error.message}`);
    }
  });
  
  // Delete transaction mutation
  const deleteTransaction = useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    }
  });
  
  // Filter transactions by financial year
  const getTransactionsByFinancialYear = (financialYearId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.financialYearId === financialYearId);
  };
  
  return {
    transactions,
    isLoading,
    error,
    createTransaction: createTransaction.mutate,
    changeStatus: (id: string, status: TransactionStatus) => changeStatus.mutate({ id, status }),
    deleteTransaction: deleteTransaction.mutate,
    getTransactionsByFinancialYear
  };
};
