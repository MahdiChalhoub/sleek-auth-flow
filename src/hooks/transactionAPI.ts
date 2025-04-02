
import { supabase } from '@/lib/supabase';
import { Transaction, JournalEntry } from '@/models/transaction';
import { toast } from 'sonner';
import { rpcParams } from '@/utils/supabaseTypes';

interface DBJournalEntry {
  id: string;
  transactionId: string;
  accountType: string;
  amount: number;
  isDebit: boolean;
  description: string;
  createdAt: string;
  createdBy: string;
}

// Helper to convert DB journal entries to our model's JournalEntry
const convertToJournalEntry = (dbEntry: DBJournalEntry): JournalEntry => {
  return {
    id: dbEntry.id,
    transactionId: dbEntry.transactionId,
    account: dbEntry.accountType,
    amount: dbEntry.amount,
    type: dbEntry.isDebit ? 'debit' : 'credit',
    description: dbEntry.description || '',
    createdAt: dbEntry.createdAt,
    updatedAt: dbEntry.createdAt, // Use createdAt as updatedAt if not available
    reference: ''
  };
};

export const transactionAPI = {
  getAll: async (): Promise<Transaction[]> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          journal_entries(*)
        `);
      
      if (error) throw error;
      
      return (data || []).map(item => {
        const journalEntries = ((item.journal_entries || []) as DBJournalEntry[])
          .map(entry => convertToJournalEntry(entry));
        
        // Use type assertion to help TypeScript understand the conversion
        const transaction = {
          id: item.id,
          amount: item.amount,
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          createdBy: item.created_by || "System",
          description: item.description || "No description",
          paymentMethod: item.payment_method || "not_specified",
          branchId: item.branch_id,
          notes: item.notes,
          referenceId: item.reference_id,
          referenceType: item.reference_type,
          type: item.type || "expense",
          financialYearId: item.financial_year_id,
          journalEntries
        } as unknown as Transaction;
        
        return transaction;
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
      return [];
    }
  },
  
  getById: async (id: string): Promise<Transaction | null> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          journal_entries(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const journalEntries = ((data.journal_entries || []) as DBJournalEntry[])
        .map(entry => convertToJournalEntry(entry));
      
      // Use type assertion to help TypeScript understand the conversion
      const transaction = {
        id: data.id,
        amount: data.amount,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by || "System",
        description: data.description || "No description",
        paymentMethod: data.payment_method || "not_specified",
        branchId: data.branch_id,
        notes: data.notes,
        referenceId: data.reference_id,
        referenceType: data.reference_type,
        type: data.type || "expense",
        financialYearId: data.financial_year_id,
        journalEntries
      } as unknown as Transaction;
      
      return transaction;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      toast.error("Failed to load transaction details");
      return null;
    }
  },
  
  create: async (transaction: Omit<Transaction, "id">): Promise<Transaction | null> => {
    try {
      // Insert transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            amount: transaction.amount,
            type: transaction.type,
            status: transaction.status || 'open',
            description: transaction.description,
            branch_id: transaction.branchId,
            reference_id: transaction.referenceId,
            reference_type: transaction.referenceType,
            payment_method: transaction.paymentMethod,
            financial_year_id: transaction.financialYearId,
            notes: transaction.notes,
            created_by: transaction.createdBy
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert journal entries if provided
      if (transaction.journalEntries && transaction.journalEntries.length > 0) {
        const entries = transaction.journalEntries.map(entry => ({
          transaction_id: data.id,
          account_type: entry.account,
          amount: entry.amount,
          is_debit: entry.type === 'debit',
          description: entry.description || '',
          reference: entry.reference || ''
        }));
        
        const { error: journalError } = await supabase
          .from('journal_entries')
          .insert(entries);
        
        if (journalError) {
          console.error("Error creating journal entries:", journalError);
          // Continue as we have the transaction already created
        }
      }
      
      // Return created transaction
      const journalEntries = transaction.journalEntries?.map(entry => ({
        ...entry,
        transactionId: data.id
      })) || [];
      
      // Use type assertion to help TypeScript understand the conversion
      const newTransaction = {
        id: data.id,
        amount: data.amount,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by || "System",
        description: data.description || "No description",
        paymentMethod: data.payment_method || "not_specified",
        branchId: data.branch_id,
        notes: data.notes,
        referenceId: data.reference_id,
        referenceType: data.reference_type,
        type: data.type || "expense",
        financialYearId: data.financial_year_id,
        journalEntries
      } as unknown as Transaction;
      
      return newTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
      return null;
    }
  },
  
  updateStatus: async (id: string, status: Transaction['status']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error updating transaction status ${id}:`, error);
      toast.error("Failed to update transaction status");
      return false;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      // First delete related journal entries
      const { error: journalDeleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('transaction_id', id);
      
      if (journalDeleteError) {
        console.error(`Error deleting journal entries for transaction ${id}:`, journalDeleteError);
        // Continue to delete the transaction regardless
      }
      
      // Then delete the transaction
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      toast.error("Failed to delete transaction");
      return false;
    }
  }
};
