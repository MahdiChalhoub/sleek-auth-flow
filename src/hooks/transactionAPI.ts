
import { supabase } from '@/lib/supabase';
import { 
  Transaction, 
  JournalEntry, 
  TransactionStatus, 
  PaymentMethod,
  DBTransaction,
  DBJournalEntry,
  TransactionType
} from '@/models/transaction';
import { typeCast } from '@/utils/supabaseTypes';
import { tableSource } from '@/utils/supabaseUtils';

// Define a proper database to model mapping function
const mapDbToTransaction = (
  dbTransaction: DBTransaction & { journal_entries?: any[] }
): Transaction => {
  // Map journal entries if they exist
  const journalEntries: JournalEntry[] = (dbTransaction.journal_entries || []).map(entry => ({
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
    journalEntries
  };
};

// Updated API with proper type handling
export const transactionsAPI = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .select('*, journal_entries(*)');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data.map(transaction => {
      return mapDbToTransaction(typeCast<DBTransaction & { journal_entries?: any[] }>(transaction));
    });
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
    
    return mapDbToTransaction(typeCast<DBTransaction & { journal_entries?: any[] }>(data));
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
      .from(tableSource('transactions'))
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
        .from(tableSource('journal_entries'))
        .insert(entries);
      
      if (entriesError) {
        console.error('Error adding journal entries:', entriesError);
        throw entriesError;
      }
    }
    
    // Return the created transaction with all the proper mappings
    return mapDbToTransaction({
      ...data,
      journal_entries: transaction.journalEntries.map(entry => ({
        id: 'temp-' + Math.random().toString(36).substring(2, 9),
        transaction_id: data.id,
        account: entry.account,
        amount: entry.amount,
        type: entry.type,
        description: entry.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    });
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
    
    return mapDbToTransaction({
      ...data,
      journal_entries: []
    });
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
