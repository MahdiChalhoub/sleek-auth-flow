
import { supabase } from '@/lib/supabase';
import { Client, createClient } from '@/models/client';
import { ClientTransaction } from '@/models/clientTransaction';

export const clientsApi = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return data.map(client => createClient({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      type: client.type,
      status: client.status,
      isVip: client.is_vip,
      creditLimit: client.credit_limit,
      outstandingBalance: client.outstanding_balance,
      lastVisit: client.last_visit,
      notes: client.notes,
      tags: client.tags,
      city: client.city,
      country: client.country,
      loyaltyPoints: client.loyalty_points,
      createdAt: client.created_at,
      updatedAt: client.updated_at
    }));
  },

  // Get a client by ID
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No results found
      }
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      type: data.type,
      status: data.status,
      isVip: data.is_vip,
      creditLimit: data.credit_limit,
      outstandingBalance: data.outstanding_balance,
      lastVisit: data.last_visit,
      notes: data.notes,
      tags: data.tags,
      city: data.city,
      country: data.country,
      loyaltyPoints: data.loyalty_points,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },

  // Create a new client
  create: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        type: clientData.type,
        status: clientData.status,
        is_vip: clientData.isVip,
        credit_limit: clientData.creditLimit,
        outstanding_balance: clientData.outstandingBalance,
        notes: clientData.notes,
        tags: clientData.tags,
        city: clientData.city,
        country: clientData.country,
        loyalty_points: clientData.loyaltyPoints
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
      type: data.type,
      status: data.status,
      isVip: data.is_vip,
      creditLimit: data.credit_limit,
      outstandingBalance: data.outstanding_balance,
      lastVisit: data.last_visit,
      notes: data.notes,
      tags: data.tags,
      city: data.city,
      country: data.country,
      loyaltyPoints: data.loyalty_points,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },

  // Update an existing client
  update: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        type: clientData.type,
        status: clientData.status,
        is_vip: clientData.isVip,
        credit_limit: clientData.creditLimit,
        outstanding_balance: clientData.outstandingBalance,
        notes: clientData.notes,
        tags: clientData.tags,
        city: clientData.city,
        country: clientData.country,
        loyalty_points: clientData.loyaltyPoints,
        updated_at: new Date().toISOString()
      })
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
      type: data.type,
      status: data.status,
      isVip: data.is_vip,
      creditLimit: data.credit_limit,
      outstandingBalance: data.outstanding_balance,
      lastVisit: data.last_visit,
      notes: data.notes,
      tags: data.tags,
      city: data.city,
      country: data.country,
      loyaltyPoints: data.loyalty_points,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },

  // Delete a client
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  },

  // Get client transactions
  getClientTransactions: async (clientId: string): Promise<ClientTransaction[]> => {
    const { data, error } = await supabase
      .from('client_transactions')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error(`Error fetching transactions for client ${clientId}:`, error);
      throw error;
    }
    
    return data.map(transaction => ({
      id: transaction.id,
      clientId: transaction.client_id,
      type: transaction.type,
      referenceId: transaction.reference_id,
      date: transaction.date,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    }));
  },

  // Record a payment from client
  recordPayment: async (
    clientId: string, 
    amount: number, 
    description: string = 'Payment received'
  ): Promise<ClientTransaction> => {
    // First, create the transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from('client_transactions')
      .insert([{
        client_id: clientId,
        type: 'payment',
        reference_id: `PMT-${Date.now()}`,
        amount,
        description,
        status: 'completed',
        date: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error recording payment:', transactionError);
      throw transactionError;
    }

    // Then update the client's outstanding balance
    const { data: clientData, error: clientError } = await supabase
      .rpc('update_client_balance', { 
        p_client_id: clientId, 
        p_amount: -amount // Negative to reduce the balance
      });
    
    if (clientError) {
      console.error('Error updating client balance:', clientError);
      throw clientError;
    }
    
    return {
      id: transactionData.id,
      clientId: transactionData.client_id,
      type: transactionData.type,
      referenceId: transactionData.reference_id,
      date: transactionData.date,
      amount: transactionData.amount,
      description: transactionData.description,
      status: transactionData.status,
      createdAt: transactionData.created_at,
      updatedAt: transactionData.updated_at
    };
  },

  // Get client credit sales
  getClientCreditSales: async (clientId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('client_credit_sales')
      .select(`
        *,
        sales:sale_id (
          id,
          total_amount,
          created_at,
          status
        )
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching credit sales for client ${clientId}:`, error);
      throw error;
    }
    
    return data;
  },

  // Create a credit sale
  createCreditSale: async (
    clientId: string,
    saleId: string,
    amount: number,
    dueDate: string
  ): Promise<any> => {
    const { data, error } = await supabase
      .from('client_credit_sales')
      .insert([{
        client_id: clientId,
        sale_id: saleId,
        amount,
        due_date: dueDate,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating credit sale:', error);
      throw error;
    }
    
    // Also create a transaction record
    await supabase
      .from('client_transactions')
      .insert([{
        client_id: clientId,
        type: 'credit',
        reference_id: saleId,
        amount,
        description: `Credit sale #${saleId}`,
        status: 'completed',
        date: new Date().toISOString()
      }]);
    
    // And update the client's outstanding balance
    await supabase
      .rpc('update_client_balance', { 
        p_client_id: clientId, 
        p_amount: amount 
      });
    
    return data;
  }
};

// Create a stored procedure to update client balance
export const setupClientBalanceFunction = async () => {
  const { error } = await supabase.rpc('create_update_client_balance_function');
  if (error) {
    console.error('Error creating stored procedure:', error);
  }
};
