
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionStatus } from '@/models/transaction';
import { tableSource } from '@/utils/supabaseUtils';
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
};

// Fetch all transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from(tableSource('transactions'))
    .select('*, journal_entries(*)');
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  return data.map(item => {
    const transaction = assertType<DbTransaction & { journal_entries?: DbJournalEntry[] }>(item);
    
    return {
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status as TransactionStatus,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
      createdBy: "System", // Default value
      description: transaction.notes || "No description",
      paymentMethod: "not_specified", // Default value
      branchId: transaction.location_id,
      notes: transaction.notes,
      referenceId: transaction.reference_id,
      referenceType: transaction.reference_type,
      type: transaction.type,
      financialYearId: transaction.financial_year_id,
      journalEntries: (transaction.journal_entries || []).map(entry => ({
        id: entry.id,
        transactionId: entry.transaction_id,
        accountType: entry.account,
        amount: entry.amount,
        isDebit: entry.type === 'debit',
        description: '',
        createdAt: entry.created_at,
        createdBy: "System"
      }))
    } as Transaction;
  });
};

// Create transaction
export const createTransactionAPI = async (
  transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> => {
  // First create the transaction
  const { data, error } = await supabase
    .from(tableSource('transactions'))
    .insert([{
      amount: transactionData.amount,
      type: transactionData.type,
      status: transactionData.status || 'open',
      notes: transactionData.description,
      location_id: transactionData.branchId,
      reference_id: transactionData.referenceId,
      reference_type: transactionData.referenceType,
      financial_year_id: transactionData.financialYearId
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
  
  const newTransaction = assertType<DbTransaction>(data);
  
  // Then create any related journal entries
  if (transactionData.journalEntries && transactionData.journalEntries.length > 0) {
    const entries = transactionData.journalEntries.map(entry => ({
      transaction_id: newTransaction.id,
      account: entry.accountType,
      amount: entry.amount,
      type: entry.isDebit ? 'debit' : 'credit',
      financial_year_id: transactionData.financialYearId
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
    id: newTransaction.id,
    amount: newTransaction.amount,
    status: newTransaction.status as TransactionStatus,
    createdAt: newTransaction.created_at,
    updatedAt: newTransaction.updated_at,
    createdBy: "System", // Default value
    description: newTransaction.notes || "No description",
    paymentMethod: "not_specified", // Default value
    branchId: newTransaction.location_id,
    notes: newTransaction.notes,
    referenceId: newTransaction.reference_id,
    referenceType: newTransaction.reference_type,
    type: newTransaction.type,
    financialYearId: newTransaction.financial_year_id,
    journalEntries: transactionData.journalEntries || []
  } as Transaction;
};

// Update transaction status
export const updateTransactionStatusAPI = async (
  params: { id: string; status: TransactionStatus }
): Promise<Transaction> => {
  const { id, status } = params;
  
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
  
  const updatedTransaction = assertType<DbTransaction>(data);
  
  return {
    id: updatedTransaction.id,
    amount: updatedTransaction.amount,
    status: updatedTransaction.status as TransactionStatus,
    createdAt: updatedTransaction.created_at,
    updatedAt: updatedTransaction.updated_at,
    createdBy: "System", // Default value
    description: updatedTransaction.notes || "No description",
    paymentMethod: "not_specified", // Default value
    branchId: updatedTransaction.location_id,
    notes: updatedTransaction.notes,
    referenceId: updatedTransaction.reference_id,
    referenceType: updatedTransaction.reference_type,
    type: updatedTransaction.type,
    financialYearId: updatedTransaction.financial_year_id,
    journalEntries: [] // We don't fetch journal entries here for simplicity
  } as Transaction;
};

// Delete transaction
export const deleteTransactionAPI = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(tableSource('transactions'))
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};
