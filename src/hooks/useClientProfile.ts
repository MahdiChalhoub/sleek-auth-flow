
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientTransaction } from '@/models/client';
import { clientsApi } from '@/api/database';

export const useClientProfile = (clientId?: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [transactions, setTransactions] = useState<ClientTransaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    if (!clientId) {
      setIsLoading(false);
      setError("No client ID provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const clientData = await clientsApi.getById(clientId);
      setClient(clientData);
    } catch (err) {
      console.error("Error fetching client:", err);
      setError(err instanceof Error ? err.message : "An error occurred while loading the client");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const refetch = useCallback(() => {
    fetchClient();
  }, [fetchClient]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!clientId) {
        setAreTransactionsLoading(false);
        return;
      }

      setAreTransactionsLoading(true);

      try {
        // For now, we'll use mock data since the API endpoint is not implemented
        // In a real implementation, you would fetch from the API:
        // const data = await clientsApi.getClientTransactions(clientId);
        
        // Mock transactions data
        const mockTransactions: ClientTransaction[] = [
          {
            id: "1",
            clientId: clientId,
            type: "invoice",
            referenceId: "INV-001",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 250.00,
            description: "Monthly subscription",
            status: "completed",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "2",
            clientId: clientId,
            type: "payment",
            referenceId: "PMT-001",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 250.00,
            description: "Payment for INV-001",
            status: "completed",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "3",
            clientId: clientId,
            type: "invoice",
            referenceId: "INV-002",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 175.50,
            description: "Additional services",
            status: "pending",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        setTransactions(mockTransactions);
      } catch (err) {
        console.error("Error fetching client transactions:", err);
      } finally {
        setAreTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [clientId]);

  return { 
    client, 
    isLoading, 
    error, 
    transactions, 
    areTransactionsLoading,
    refetch 
  };
};
