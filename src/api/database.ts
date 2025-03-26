
import { supabase } from '@/integrations/supabase/client';
import { Client, createClient } from '@/models/client';
import { Supplier } from '@/models/supplier';
import { StockTransfer } from '@/models/stockTransfer';
import { Transaction, LedgerEntry, PaymentMethod, TransactionStatus } from '@/models/transaction';

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
    
    return (data || []).map(item => createClient({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      loyaltyPoints: item.loyalty_points,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
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
    
    if (!data) return null;
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      loyaltyPoints: data.loyalty_points,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },
  
  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        loyalty_points: client.loyaltyPoints || 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      loyaltyPoints: data.loyalty_points,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },
  
  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.loyaltyPoints) dbUpdates.loyalty_points = updates.loyaltyPoints;
    
    const { data, error } = await supabase
      .from('clients')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      loyaltyPoints: data.loyalty_points,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
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
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      contactPerson: item.contact_person || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      notes: item.notes,
      products: [] // Default empty array for products
    }));
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
    
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes,
      products: [] // Default empty array for products
    };
  },
  
  create: async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([{
        name: supplier.name,
        contact_person: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        notes: supplier.notes
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes,
      products: [] // Default empty array for products
    };
  },
  
  update: async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.contactPerson) dbUpdates.contact_person = updates.contactPerson;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.notes) dbUpdates.notes = updates.notes;
    
    const { data, error } = await supabase
      .from('suppliers')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes,
      products: [] // Default empty array for products
    };
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
    
    return (data || []).map(item => ({
      id: item.id,
      date: item.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: item.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: item.destination_location_id,
      reason: item.notes || 'Stock Transfer',
      status: mapDatabaseStatus(item.status),
      notes: item.notes,
      createdBy: 'System', // Default value
      items: (item.stock_transfer_items || []).map(transferItem => ({
        productId: transferItem.product_id,
        productName: 'Product', // Default placeholder
        quantity: transferItem.quantity
      }))
    }));
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
    
    return {
      id: data.id,
      date: data.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: data.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: data.destination_location_id,
      reason: data.notes || 'Stock Transfer',
      status: mapDatabaseStatus(data.status),
      notes: data.notes,
      createdBy: 'System', // Default value
      items: (data.stock_transfer_items || []).map(transferItem => ({
        productId: transferItem.product_id,
        productName: 'Product', // Default placeholder
        quantity: transferItem.quantity
      }))
    };
  },
  
  create: async (transfer: Omit<StockTransfer, 'id'>): Promise<StockTransfer> => {
    const { data, error } = await supabase
      .from('stock_transfers')
      .insert([{
        source_location_id: transfer.sourceLocationId,
        destination_location_id: transfer.destinationLocationId,
        notes: transfer.notes,
        status: mapToDbStatus(transfer.status) // Map from our status to db status
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating stock transfer:', error);
      throw error;
    }
    
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
    
    return {
      id: data.id,
      date: data.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: data.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: data.destination_location_id,
      reason: data.notes || 'Stock Transfer',
      status: mapDatabaseStatus(data.status),
      notes: data.notes,
      createdBy: 'System', // Default value
      items: transfer.items || []
    };
  },
  
  update: async (id: string, updates: Partial<StockTransfer>): Promise<StockTransfer> => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = mapToDbStatus(updates.status);
    if (updates.notes) dbUpdates.notes = updates.notes;
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('stock_transfers')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating stock transfer ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      date: data.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: data.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: data.destination_location_id,
      reason: data.notes || 'Stock Transfer',
      status: mapDatabaseStatus(data.status),
      notes: data.notes,
      createdBy: 'System', // Default value
      items: [] // Default empty array
    };
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
      .from('transactions')
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
      .from('transactions')
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
        .from('journal_entries')
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
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }
};

// Helper function to map database status to our internal status
function mapDatabaseStatus(status: string): "draft" | "sent" | "verified" | "cancelled" {
  switch (status) {
    case 'pending': return 'draft';
    case 'in-transit': return 'sent';
    case 'completed': return 'verified';
    case 'cancelled': return 'cancelled';
    default: return 'draft';
  }
}

// Helper function to map our internal status to database status
function mapToDbStatus(status: "draft" | "sent" | "verified" | "cancelled"): string {
  switch (status) {
    case 'draft': return 'pending';
    case 'sent': return 'in-transit';
    case 'verified': return 'completed';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
}
