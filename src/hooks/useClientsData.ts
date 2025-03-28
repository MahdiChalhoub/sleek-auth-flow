
import { useState, useEffect } from 'react';
import { Client } from '@/models/client';
import { clientsApi } from '@/api/database';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const clientsData = await clientsApi.getAll();
        setClients(clientsData);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(err instanceof Error ? err.message : "An error occurred while loading clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, isLoading, error };
};
