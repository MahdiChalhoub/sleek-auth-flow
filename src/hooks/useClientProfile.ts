
import { useState, useEffect } from 'react';
import { Client } from '@/models/client';
import { ClientTransaction } from '@/models/clientTransaction';
import { clientsApi } from '@/api/clientsApi';

export const useClientProfile = (clientId?: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [transactions, setTransactions] = useState<ClientTransaction[] | null>(null);
  const [creditSales, setCreditSales] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(true);
  const [areCreditSalesLoading, setAreCreditSalesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
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
    };

    fetchClient();
  }, [clientId]);

  // Fetch client transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!clientId) {
        setAreTransactionsLoading(false);
        return;
      }

      setAreTransactionsLoading(true);

      try {
        const transactionsData = await clientsApi.getClientTransactions(clientId);
        setTransactions(transactionsData);
      } catch (err) {
        console.error("Error fetching client transactions:", err);
      } finally {
        setAreTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [clientId]);

  // Fetch client credit sales
  useEffect(() => {
    const fetchCreditSales = async () => {
      if (!clientId) {
        setAreCreditSalesLoading(false);
        return;
      }

      setAreCreditSalesLoading(true);

      try {
        const creditSalesData = await clientsApi.getClientCreditSales(clientId);
        setCreditSales(creditSalesData);
      } catch (err) {
        console.error("Error fetching client credit sales:", err);
      } finally {
        setAreCreditSalesLoading(false);
      }
    };

    fetchCreditSales();
  }, [clientId]);

  // Record a payment
  const recordPayment = async (amount: number, description?: string) => {
    if (!clientId || !client) return null;
    
    try {
      const payment = await clientsApi.recordPayment(clientId, amount, description);
      
      // Update local state
      setTransactions(prev => prev ? [payment, ...prev] : [payment]);
      
      // Update client balance
      setClient(prev => {
        if (!prev) return null;
        return {
          ...prev,
          outstandingBalance: (prev.outstandingBalance || 0) - amount
        };
      });
      
      return payment;
    } catch (err) {
      console.error("Error recording payment:", err);
      throw err;
    }
  };

  return { 
    client, 
    isLoading, 
    error, 
    transactions, 
    areTransactionsLoading,
    creditSales,
    areCreditSalesLoading,
    recordPayment
  };
};
