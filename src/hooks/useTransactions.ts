
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus } from '@/models/transaction';
import { toast } from 'sonner';
import { useFinancialYears } from './useFinancialYears';
import { 
  fetchTransactions, 
  createTransactionAPI, 
  updateTransactionStatusAPI, 
  deleteTransactionAPI 
} from './transactionAPI';

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const { currentFinancialYear } = useFinancialYears();
  
  // Fetch all transactions
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  });
  
  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
      // If financial year is not provided, use the current financial year
      const financialYearId = transactionData.financialYearId || currentFinancialYear?.id;
      
      if (!financialYearId) {
        throw new Error('No active financial year. Cannot create transaction without a financial year.');
      }
      
      return createTransactionAPI({
        ...transactionData,
        financialYearId
      });
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
    mutationFn: updateTransactionStatusAPI,
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
    mutationFn: deleteTransactionAPI,
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
    changeStatus: changeStatus.mutate,
    deleteTransaction: deleteTransaction.mutate,
    getTransactionsByFinancialYear
  };
};
