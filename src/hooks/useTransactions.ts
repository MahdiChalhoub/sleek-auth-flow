
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/database';
import { Transaction } from '@/models/transaction';
import { toast } from 'sonner';

export const useTransactions = () => {
  const queryClient = useQueryClient();
  
  // Fetch all transactions
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionsApi.getAll
  });
  
  // Change transaction status mutation
  const changeStatus = useMutation({
    mutationFn: ({ transactionId, newStatus }: { transactionId: string, newStatus: "open" | "locked" | "verified" | "secure" }) => 
      transactionsApi.updateStatus(transactionId, newStatus),
    onSuccess: () => {
      toast.success('Transaction status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.error(`Failed to update transaction status: ${error.message}`);
    }
  });
  
  // Delete transaction mutation
  const deleteTransaction = useMutation({
    mutationFn: (transactionId: string) => transactionsApi.delete(transactionId),
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
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
