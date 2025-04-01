
import { supabase } from '@/integrations/supabase/client';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus } from '@/models/transaction';
import { tableSource } from '@/utils/supabaseUtils';

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .select('*, journal_entries(*)');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      amount: item.amount,
      status: item.status as TransactionStatus,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdBy: "System", // Default value
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
  },
  
  getById: async (id: string): Promise<Transaction | null> => {
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .select('*, journal_entries(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      amount: data.amount,
      status: data.status as TransactionStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: "System", // Default value
      description: data.notes || "No description",
      paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
      branchId: data.location_id,
      notes: data.notes,
      referenceId: data.reference_id,
      referenceType: data.reference_type,
      type: data.type,
      journalEntries: (data.journal_entries || []).map(entry => ({
        id: entry.id,
        transactionId: entry.transaction_id,
        accountType: entry.account,
        amount: entry.amount,
        isDebit: entry.type === 'debit',
        description: '',
        createdAt: entry.created_at,
        createdBy: "System"
      })) as LedgerEntry[]
    } as Transaction;
  },
  
  create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .insert([{
        amount: transaction.amount,
        type: transaction.type, 
        status: transaction.status || 'open',
        notes: transaction.description,
        location_id: transaction.branchId,
        reference_id: transaction.referenceId,
        reference_type: transaction.referenceType
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    
    if (transaction.journalEntries && transaction.journalEntries.length > 0) {
      const entries = transaction.journalEntries.map(entry => ({
        transaction_id: data.id,
        account: entry.accountType,
        amount: entry.amount,
        type: entry.isDebit ? 'debit' : 'credit',
        description: entry.description,
        reference: entry.reference
      }));
      
      const { error: entriesError } = await supabase
        .from(tableSource('journal_entries'))
        .insert(entries);
      
      if (entriesError) {
        console.error('Error adding journal entries:', entriesError);
        throw entriesError;
      }
    }
    
    return {
      id: data.id,
      amount: data.amount,
      status: data.status as TransactionStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: "System", // Default value
      description: data.notes || "No description",
      paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
      branchId: data.location_id,
      notes: data.notes,
      referenceId: data.reference_id,
      referenceType: data.reference_type,
      type: data.type,
      journalEntries: transaction.journalEntries || []
    } as Transaction;
  },
  
  updateStatus: async (id: string, status: TransactionStatus): Promise<Transaction> => {
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating transaction status ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      amount: data.amount,
      status: data.status as TransactionStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: "System", // Default value
      description: data.notes || "No description",
      paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
      branchId: data.location_id,
      notes: data.notes,
      referenceId: data.reference_id,
      referenceType: data.reference_type,
      type: data.type,
      journalEntries: []
    } as Transaction;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(tableSource('transactions'))
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }
};
