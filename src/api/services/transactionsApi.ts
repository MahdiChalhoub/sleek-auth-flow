
import { supabase } from '@/integrations/supabase/client';
import { Transaction, JournalEntry, PaymentMethod, TransactionStatus, TransactionType } from '@/models/transaction';
import { fromTable } from '@/utils/supabaseServiceHelper';
import { assertType } from '@/utils/typeUtils';

type DbTransaction = {
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
};

type DbJournalEntry = {
  id: string;
  transaction_id: string;
  account: string;
  amount: number;
  type: 'debit' | 'credit';
  created_at: string;
  updated_at: string;
  description?: string;
  reference?: string;
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await fromTable('transactions')
      .select('*, journal_entries(*)');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data.map(item => {
      const transaction = assertType<DbTransaction & { journal_entries?: DbJournalEntry[] }>(item);
      
      const journalEntries: JournalEntry[] = (transaction.journal_entries || []).map(entry => ({
        id: entry.id,
        transactionId: entry.transaction_id,
        account: entry.account,
        amount: entry.amount,
        type: entry.type,
        description: entry.description || '',
        reference: entry.reference,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at
      }));

      return {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status as TransactionStatus,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
        createdBy: "System", // Default value
        description: transaction.notes || "No description",
        paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
        branchId: transaction.location_id,
        notes: transaction.notes,
        referenceId: transaction.reference_id,
        referenceType: transaction.reference_type,
        type: transaction.type as TransactionType,
        financialYearId: transaction.financial_year_id,
        journalEntries
      } as Transaction;
    });
  },
  
  getById: async (id: string): Promise<Transaction | null> => {
    const { data, error } = await fromTable('transactions')
      .select('*, journal_entries(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
    
    const transaction = assertType<DbTransaction & { journal_entries?: DbJournalEntry[] }>(data);
    
    const journalEntries: JournalEntry[] = (transaction.journal_entries || []).map(entry => ({
      id: entry.id,
      transactionId: entry.transaction_id,
      account: entry.account,
      amount: entry.amount,
      type: entry.type,
      description: entry.description || '',
      reference: entry.reference,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at
    }));

    return {
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status as TransactionStatus,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
      createdBy: "System", // Default value
      description: transaction.notes || "No description",
      paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
      branchId: transaction.location_id,
      notes: transaction.notes,
      referenceId: transaction.reference_id,
      referenceType: transaction.reference_type,
      type: transaction.type as TransactionType,
      financialYearId: transaction.financial_year_id,
      journalEntries
    } as Transaction;
  },
  
  create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await fromTable('transactions')
      .insert([{
        amount: transaction.amount,
        type: transaction.type, 
        status: transaction.status || 'open',
        notes: transaction.description,
        location_id: transaction.branchId,
        reference_id: transaction.referenceId,
        reference_type: transaction.referenceType,
        financial_year_id: transaction.financialYearId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    
    const newTransaction = assertType<DbTransaction>(data);
    
    if (transaction.journalEntries && transaction.journalEntries.length > 0) {
      const entries = transaction.journalEntries.map(entry => ({
        transaction_id: newTransaction.id,
        account: entry.account,
        amount: entry.amount,
        type: entry.type,
        description: entry.description,
        reference: entry.reference
      }));
      
      const { error: entriesError } = await fromTable('journal_entries')
        .insert(entries);
      
      if (entriesError) {
        console.error('Error adding journal entries:', entriesError);
        throw entriesError;
      }
    }
    
    return {
      id: newTransaction.id,
      amount: newTransaction.amount,
      status: newTransaction.status as TransactionStatus,
      createdAt: newTransaction.created_at,
      updatedAt: newTransaction.updated_at,
      createdBy: "System", // Default value
      description: newTransaction.notes || "No description",
      paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
      branchId: newTransaction.location_id,
      notes: newTransaction.notes,
      referenceId: newTransaction.reference_id,
      referenceType: newTransaction.reference_type,
      type: newTransaction.type as TransactionType,
      financialYearId: newTransaction.financial_year_id,
      journalEntries: transaction.journalEntries || []
    } as Transaction;
  },
  
  updateStatus: async (id: string, status: TransactionStatus): Promise<Transaction> => {
    const { data, error } = await fromTable('transactions')
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
    
    const updatedTransaction = assertType<DbTransaction>(data);
    
    return {
      id: updatedTransaction.id,
      amount: updatedTransaction.amount,
      status: updatedTransaction.status as TransactionStatus,
      createdAt: updatedTransaction.created_at,
      updatedAt: updatedTransaction.updated_at,
      createdBy: "System", // Default value
      description: updatedTransaction.notes || "No description",
      paymentMethod: "not_specified" as PaymentMethod, // Cast to PaymentMethod
      branchId: updatedTransaction.location_id,
      notes: updatedTransaction.notes,
      referenceId: updatedTransaction.reference_id,
      referenceType: updatedTransaction.reference_type,
      type: updatedTransaction.type as TransactionType,
      financialYearId: updatedTransaction.financial_year_id, 
      journalEntries: []
    } as Transaction;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await fromTable('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }
};
