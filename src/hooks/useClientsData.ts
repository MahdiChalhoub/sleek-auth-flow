
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
          type: 'regular', // Default type
          status: 'active', // Default status
          loyaltyPoints: client.loyalty_points || 0,
          createdAt: client.created_at,
          updatedAt: client.updated_at
        }));
        
        setClients(transformedClients as Client[]);
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
          loyalty_points: clientData.loyaltyPoints || 0
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
          loyalty_points: clientData.loyaltyPoints
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
