
import { supabase } from '@/lib/supabase';
import { Transaction, LedgerEntry, TransactionStatus } from '@/models/transaction';
import { tableSource } from '@/utils/supabaseUtils';

export async function fetchTransactions() {
  try {
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .select('*, journal_entries(*)');
    
    if (error) {
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
      paymentMethod: "not_specified", // Cast to PaymentMethod
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
    // Fallback to empty array if error
    return [];
  }
}

export async function createTransactionAPI(
  transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { financialYearId: string }
) {
  try {
    // Check if the financial year is closed
    await checkFinancialYearStatus(transactionData.financialYearId);
  
    // Create the transaction
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .insert({
        amount: transactionData.amount,
        status: transactionData.status,
        notes: transactionData.description || transactionData.notes,
        type: transactionData.type || 'general',
        location_id: transactionData.branchId,
        reference_id: transactionData.referenceId,
        reference_type: transactionData.referenceType,
        financial_year_id: transactionData.financialYearId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error("Error in createTransaction:", err);
    throw err;
  }
}

export async function updateTransactionStatusAPI({ 
  transactionId, 
  newStatus 
}: { 
  transactionId: string, 
  newStatus: TransactionStatus 
}) {
  try {
    // Get the transaction to check its financial year
    const { data: transaction, error: fetchError } = await supabase
      .from(tableSource('transactions'))
      .select('financial_year_id')
      .eq('id', transactionId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Check if the financial year is closed
    if (transaction?.financial_year_id) {
      await checkFinancialYearStatus(transaction.financial_year_id);
    }
    
    const { data, error } = await supabase
      .from(tableSource('transactions'))
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', transactionId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Error in updateTransactionStatus:", err);
    throw err;
  }
}

export async function deleteTransactionAPI(transactionId: string) {
  try {
    // Get the transaction to check its financial year
    const { data: transaction, error: fetchError } = await supabase
      .from(tableSource('transactions'))
      .select('financial_year_id')
      .eq('id', transactionId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Check if the financial year is closed
    if (transaction?.financial_year_id) {
      await checkFinancialYearStatus(transaction.financial_year_id);
    }
    
    const { error } = await supabase
      .from(tableSource('transactions'))
      .delete()
      .eq('id', transactionId);
    
    if (error) {
      throw error;
    }
  } catch (err) {
    console.error("Error in deleteTransaction:", err);
    throw err;
  }
}

// Helper function to check if a financial year is closed
async function checkFinancialYearStatus(financialYearId: string) {
  try {
    const { data, error } = await supabase
      .from(tableSource('financial_years'))
      .select('status')
      .eq('id', financialYearId)
      .single();

    if (!error && data?.status === 'closed') {
      throw new Error('Cannot modify transactions in a closed financial year');
    }
  } catch (err) {
    // If the table doesn't exist or there's another error, we can proceed
    if (err.message === 'Cannot modify transactions in a closed financial year') {
      throw err;
    }
    console.error("Error checking financial year status:", err);
  }
}
