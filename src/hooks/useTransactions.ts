
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/database';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus } from '@/models/transaction';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useTransactions = () => {
  const queryClient = useQueryClient();
  
  // Fetch all transactions from Supabase
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
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
        journalEntries: (item.journal_entries || []).map(entry => ({
          id: entry.id,
          transactionId: entry.transaction_id,
          accountType: entry.account,
          amount: entry.amount,
          isDebit: entry.type === 'debit',
          description: '',
          createdAt: entry.created_at,
          createdBy: "System"
        })) as LedgerEntry[]
      })) as Transaction[];
    }
  });
  
  // Change transaction status mutation
  const changeStatus = useMutation({
    mutationFn: async ({ transactionId, newStatus }: { transactionId: string, newStatus: TransactionStatus }) => {
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
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);
      
      if (error) {
        throw error;
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
  
  return {
    transactions,
    isLoading,
    error,
    changeStatus: changeStatus.mutate,
    deleteTransaction: deleteTransaction.mutate
  };
};
