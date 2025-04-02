
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus, TransactionType, JournalEntry } from '@/models/transaction';
import { toast } from 'sonner';
import { useFinancialYears } from './useFinancialYears';
import { transactionsApi } from '@/api/database';

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
