
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/database';
import { Transaction } from '@/models/transaction';
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
      
      return data.map(item => ({
        ...item,
        journalEntries: item.journal_entries || []
      })) as Transaction[];
    }
  });
  
  // Change transaction status mutation
  const changeStatus = useMutation({
    mutationFn: async ({ transactionId, newStatus }: { transactionId: string, newStatus: "open" | "locked" | "verified" | "secure" }) => {
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
