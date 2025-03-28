import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/database';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus } from '@/models/transaction';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useFinancialYears } from './useFinancialYears';

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const { activeYear } = useFinancialYears();
  
  // Fetch all transactions from Supabase
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      // First, check if the financial_years table exists
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*, journal_entries(*)');
        
        if (error) {
          toast.error(`Error fetching transactions: ${error.message}`);
          throw error;
        }
        
        // Transform the data to match our Transaction interface
        return data.map(item => ({
          id: item.id,
          amount: item.amount,
          status: item.status as TransactionStatus,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          // Set a default value for createdBy since it's not in the database
          createdBy: "System",
          description: item.notes || "No description",
          paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
          branchId: item.location_id,
          notes: item.notes,
          referenceId: item.reference_id,
          referenceType: item.reference_type,
          type: item.type,
          financialYearId: item.financial_year_id,
          journalEntries: (item.journal_entries || []).map(entry => ({
            id: entry.id,
            transactionId: entry.transaction_id,
            accountType: entry.account,
            amount: entry.amount,
            isDebit: entry.type === 'debit',
            description: '',
            createdAt: entry.created_at,
            createdBy: "System",
            financialYearId: entry.financial_year_id
          })) as LedgerEntry[]
        })) as Transaction[];
      } catch (err) {
        console.error("Error fetching transactions:", err);
        // Fallback to mock data if needed
        return [];
      }
    }
  });
  
  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
      // If financial year is not provided, use the current financial year
      const financialYearId = transactionData.financialYearId || activeYear?.id;
      
      if (!financialYearId) {
        throw new Error('No active financial year. Cannot create transaction without a financial year.');
      }
      
      try {
        // Check if the financial_years table exists and if the year is closed
        const financialYearResponse = await supabase
          .from('financial_years')
          .select('status')
          .eq('id', financialYearId)
          .single();

        if (financialYearResponse.error) {
          console.error("Error checking financial year:", financialYearResponse.error);
          // If the table doesn't exist or there's another error, we can proceed with the transaction
        } else if (financialYearResponse.data?.status === 'closed') {
          throw new Error('Cannot create transaction in a closed financial year');
        }
      
        // Create the transaction
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            amount: transactionData.amount,
            status: transactionData.status,
            notes: transactionData.description || transactionData.notes,
            type: transactionData.type || 'general',
            location_id: transactionData.branchId,
            reference_id: transactionData.referenceId,
            reference_type: transactionData.referenceType,
            financial_year_id: financialYearId
          })
          .select()
          .single();
        
        if (error) throw error;
        
        return data;
      } catch (err) {
        console.error("Error in createTransaction:", err);
        throw err;
      }
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
    mutationFn: async ({ transactionId, newStatus }: { transactionId: string, newStatus: TransactionStatus }) => {
      try {
        // Get the transaction to check its financial year
        const transactionResponse = await supabase
          .from('transactions')
          .select('financial_year_id')
          .eq('id', transactionId)
          .single();
        
        if (transactionResponse.error) {
          console.error("Error fetching transaction:", transactionResponse.error);
          throw transactionResponse.error;
        }
        
        const financialYearId = transactionResponse.data?.financial_year_id;
        
        // Check if the financial year is closed, if it exists
        if (financialYearId) {
          try {
            const financialYearResponse = await supabase
              .from('financial_years')
              .select('status')
              .eq('id', financialYearId)
              .single();

            if (!financialYearResponse.error && financialYearResponse.data?.status === 'closed') {
              throw new Error('Cannot modify transactions in a closed financial year');
            }
          } catch (err) {
            // If the table doesn't exist or there's another error, we can proceed with the transaction
            console.error("Error checking financial year status:", err);
          }
        }
        
        const { data, error } = await supabase
          .from('transactions')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', transactionId)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error("Error in changeStatus:", err);
        throw err;
      }
    },
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
    mutationFn: async (transactionId: string) => {
      try {
        // Get the transaction to check its financial year
        const transactionResponse = await supabase
          .from('transactions')
          .select('financial_year_id')
          .eq('id', transactionId)
          .single();
        
        if (transactionResponse.error) {
          console.error("Error fetching transaction:", transactionResponse.error);
          throw transactionResponse.error;
        }
        
        const financialYearId = transactionResponse.data?.financial_year_id;
        
        // Check if the financial year is closed, if it exists
        if (financialYearId) {
          try {
            const financialYearResponse = await supabase
              .from('financial_years')
              .select('status')
              .eq('id', financialYearId)
              .single();

            if (!financialYearResponse.error && financialYearResponse.data?.status === 'closed') {
              throw new Error('Cannot delete transactions in a closed financial year');
            }
          } catch (err) {
            // If the table doesn't exist or there's another error, we can proceed with the transaction
            console.error("Error checking financial year status:", err);
          }
        }
        
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', transactionId);
        
        if (error) {
          throw error;
        }
      } catch (err) {
        console.error("Error in deleteTransaction:", err);
        throw err;
      }
    },
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
