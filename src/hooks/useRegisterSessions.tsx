
import { useState, useEffect } from 'react';
import { fetchRegisters, getRegisterById } from './register/registerService';
import { Register } from '@/models/register';
import { mockRegisters } from '@/models/register';
import { openRegister, closeRegister, resolveDiscrepancy } from './register/registerOperations';

export const useRegisterSessions = () => {
  const [registers, setRegisters] = useState<Register[]>(mockRegisters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const fetchedRegisters = await fetchRegisters();
      setRegisters(fetchedRegisters.length > 0 ? fetchedRegisters : mockRegisters);
      setError(null);
    } catch (err) {
      console.error('Error loading registers:', err);
      setError(err instanceof Error ? err : new Error('Failed to load registers'));
      setRegisters(mockRegisters); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegisters();
  }, []);

  const getRegisterByIdWithFallback = async (id: string): Promise<Register | null> => {
    try {
      const register = await getRegisterById(id);
      if (!register) {
        // If not found in database, try to find in mock data
        return mockRegisters.find(r => r.id === id) || null;
      }
      return register;
    } catch (err) {
      console.error(`Error fetching register ${id}:`, err);
      // Fallback to mock data
      return mockRegisters.find(r => r.id === id) || null;
    }
  };

  return {
    registers,
    getRegisterById: getRegisterByIdWithFallback,
    refresh: loadRegisters,
    isLoading,
    error,
    openRegister,
    closeRegister,
    resolveDiscrepancy
  };
};
