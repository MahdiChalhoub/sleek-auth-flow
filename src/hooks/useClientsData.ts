
import { useState, useEffect } from 'react';
import { Client } from '@/models/client';
import { clientsApi } from '@/api/database';
import { supabase } from '@/lib/supabase';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from Supabase first
      const { data: supabaseClients, error: supabaseError } = await supabase
        .from('clients')
        .select('*');
      
      if (!supabaseError && supabaseClients?.length > 0) {
        // Transform data to match our Client model if needed
        const transformedClients = supabaseClients.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          type: client.type || 'regular',
          status: client.status || 'active',
          loyaltyPoints: client.loyalty_points || 0,
          isVip: client.is_vip || false,
          createdAt: client.created_at,
          updatedAt: client.updated_at,
          outstanding_balance: client.outstanding_balance || 0,
          credit_limit: client.credit_limit || 0,
          tags: client.tags || [],
          notes: client.notes || ''
        })) as Client[];
        
        setClients(transformedClients);
      } else {
        // Fallback to mock API if Supabase fails
        const clientsData = await clientsApi.getAll();
        setClients(clientsData);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err.message : "An error occurred while loading clients");
      
      // Try to fallback to mock data
      try {
        const clientsData = await clientsApi.getAll();
        setClients(clientsData);
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          type: clientData.type || 'regular',
          status: clientData.status || 'active',
          loyalty_points: clientData.loyaltyPoints || 0,
          is_vip: clientData.isVip || false
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the clients list
      fetchClients();
      return data;
    } catch (err) {
      console.error("Error creating client:", err);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          type: clientData.type,
          status: clientData.status,
          loyalty_points: clientData.loyaltyPoints,
          is_vip: clientData.isVip
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the clients list
      fetchClients();
      return data;
    } catch (err) {
      console.error("Error updating client:", err);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the clients list
      fetchClients();
    } catch (err) {
      console.error("Error deleting client:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { 
    clients, 
    isLoading, 
    error, 
    refreshClients: fetchClients,
    createClient,
    updateClient,
    deleteClient
  };
};
