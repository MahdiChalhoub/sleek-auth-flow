
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/models/client';
import { Supplier } from '@/models/supplier';
import { StockTransfer } from '@/models/stockTransfer';
import { Transaction } from '@/models/transaction';

// Clients API
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    
    return data;
  },
  
  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
};

// Suppliers API
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*');
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getById: async (id: string): Promise<Supplier | null> => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  create: async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([supplier])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
    
    return data;
  },
  
  update: async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting supplier ${id}:`, error);
      throw error;
    }
  }
};

// Stock Transfers API
export const stockTransfersApi = {
  getAll: async (): Promise<StockTransfer[]> => {
    const { data, error } = await supabase
      .from('stock_transfers')
      .select('*, stock_transfer_items(*)');
    
    if (error) {
      console.error('Error fetching stock transfers:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getById: async (id: string): Promise<StockTransfer | null> => {
    const { data, error } = await supabase
      .from('stock_transfers')
      .select('*, stock_transfer_items(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching stock transfer ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  create: async (transfer: Omit<StockTransfer, 'id'>): Promise<StockTransfer> => {
    const { data, error } = await supabase
      .from('stock_transfers')
      .insert([{
        source_location_id: transfer.sourceLocationId,
        destination_location_id: transfer.destinationLocationId,
        notes: transfer.notes,
        status: transfer.status
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating stock transfer:', error);
      throw error;
    }
    
    // Add items if they exist
    if (transfer.items && transfer.items.length > 0) {
      const items = transfer.items.map(item => ({
        stock_transfer_id: data.id,
        product_id: item.productId,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('stock_transfer_items')
        .insert(items);
      
      if (itemsError) {
        console.error('Error adding stock transfer items:', itemsError);
        throw itemsError;
      }
    }
    
    return data;
  },
  
  update: async (id: string, updates: Partial<StockTransfer>): Promise<StockTransfer> => {
    const { data, error } = await supabase
      .from('stock_transfers')
      .update({
        status: updates.status,
        notes: updates.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating stock transfer ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('stock_transfers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting stock transfer ${id}:`, error);
      throw error;
    }
  }
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, journal_entries(*)');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data.map(item => ({
      ...item,
      journalEntries: item.journal_entries || []
    })) as Transaction[];
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
    
    return {
      ...data,
      journalEntries: data.journal_entries || []
    } as Transaction;
  },
  
  create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status || 'open',
        description: transaction.description,
        payment_method: transaction.paymentMethod,
        location_id: transaction.branchId,
        reference_id: transaction.referenceId,
        reference_type: transaction.referenceType,
        notes: transaction.notes
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
    
    // Add journal entries if they exist
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
        .from('journal_entries')
        .insert(entries);
      
      if (entriesError) {
        console.error('Error adding journal entries:', entriesError);
        throw entriesError;
      }
    }
    
    return data;
  },
  
  updateStatus: async (id: string, status: "open" | "locked" | "verified" | "secure"): Promise<Transaction> => {
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
    
    return data;
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
