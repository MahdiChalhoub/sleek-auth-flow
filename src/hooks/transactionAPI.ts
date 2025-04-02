
import { supabase } from '@/lib/supabase';
import { 
  Transaction, 
  JournalEntry, 
  TransactionStatus, 
  PaymentMethod,
  TransactionType
} from '@/models/transaction';
import { assertType } from '@/utils/typeUtils';

// Define database transaction type
export interface DBTransaction {
  id: string;
  amount: number;
  status: string;
  type: string;
  notes: string | null;
  location_id: string | null;
  reference_id: string | null;
  reference_type: string | null;
  financial_year_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBJournalEntry {
  id: string;
  transaction_id: string;
  account: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Define a proper database to model mapping function
const mapDbToTransaction = (
  dbTransaction: DBTransaction, 
  journalEntries: DBJournalEntry[] = []
): Transaction => {
  // Map journal entries if they exist
  const mappedJournalEntries: JournalEntry[] = journalEntries.map(entry => ({
    id: entry.id,
    transactionId: entry.transaction_id,
    account: entry.account,
    amount: entry.amount,
    type: entry.type as 'debit' | 'credit',
    description: entry.description || '',
    createdAt: entry.created_at,
    updatedAt: entry.updated_at
  }));

  // Map the transaction with safe defaults
  return {
    id: dbTransaction.id,
    amount: dbTransaction.amount,
    status: dbTransaction.status as TransactionStatus,
    type: (dbTransaction.type || 'expense') as TransactionType,
    description: dbTransaction.notes || 'No description',
    createdAt: dbTransaction.created_at,
    updatedAt: dbTransaction.updated_at,
    createdBy: 'System', // Default value
    paymentMethod: 'not_specified' as PaymentMethod,
    branchId: dbTransaction.location_id || undefined,
    notes: dbTransaction.notes || undefined,
    referenceId: dbTransaction.reference_id || undefined,
    referenceType: dbTransaction.reference_type || undefined,
    financialYearId: dbTransaction.financial_year_id || undefined,
    journalEntries: mappedJournalEntries
  };
};

// Updated API with proper type handling
export const transactionsAPI = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, journal_entries(*)');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data.map(transaction => {
      const dbTransaction = transaction as unknown as DBTransaction & { journal_entries?: DBJournalEntry[] };
      return mapDbToTransaction(dbTransaction, dbTransaction.journal_entries || []);
    });
  },
  
  getById: async (id: string): Promise<Transaction | null> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, journal_entries(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
    
    const dbTransaction = data as unknown as DBTransaction & { journal_entries?: DBJournalEntry[] };
    return mapDbToTransaction(dbTransaction, dbTransaction.journal_entries || []);
  },
  
  create: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    // Map from our application model to the database model
    const dbTransaction = {
      amount: transaction.amount,
      type: transaction.type, 
      status: transaction.status || 'open',
      notes: transaction.description,
      location_id: transaction.branchId,
      reference_id: transaction.referenceId,
      reference_type: transaction.referenceType,
      financial_year_id: transaction.financialYearId
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([dbTransaction])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    
    // If we have journal entries, create them as well
    if (transaction.journalEntries && transaction.journalEntries.length > 0) {
      const entries = transaction.journalEntries.map(entry => ({
        transaction_id: data.id,
        account: entry.account,
        amount: entry.amount,
        type: entry.type,
        description: entry.description || ''
      }));
      
      const { error: entriesError } = await supabase
        .from('journal_entries')
        .insert(entries);
      
      if (entriesError) {
        console.error('Error adding journal entries:', entriesError);
        throw entriesError;
      }
    }
    
    // Create temporary journal entries for return value
    const tempJournalEntries: DBJournalEntry[] = transaction.journalEntries?.map(entry => ({
      id: 'temp-' + Math.random().toString(36).substring(2, 9),
      transaction_id: data.id,
      account: entry.account,
      amount: entry.amount,
      type: entry.type,
      description: entry.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || [];
    
    // Return the created transaction with all the proper mappings
    return mapDbToTransaction(data as unknown as DBTransaction, tempJournalEntries);
  },
  
  updateStatus: async (id: string, status: TransactionStatus): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
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
    
    return mapDbToTransaction(data as unknown as DBTransaction, []);
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }
};
