
import { useState, useEffect } from 'react';
import { Register, DiscrepancyResolution } from '@/models/interfaces/registerInterfaces';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { typeCast } from '@/utils/supabaseTypes';

export const useRegisterSessions = () => {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRegisters();
  }, []);

  const fetchRegisters = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('register_sessions')
        .select('*');
      
      if (error) throw error;
      
      const formattedRegisters: Register[] = data.map(register => ({
        id: register.id,
        name: register.name,
        isOpen: register.is_open,
        openedAt: register.opened_at,
        closedAt: register.closed_at,
        openedBy: register.opened_by,
        closedBy: register.closed_by,
        discrepancyApprovedAt: register.discrepancy_approved_at,
        discrepancyApprovedBy: register.discrepancy_approved_by,
        discrepancyResolution: register.discrepancy_resolution as DiscrepancyResolution,
        discrepancyNotes: register.discrepancy_notes,
        discrepancies: register.discrepancies,
        openingBalance: register.opening_balance,
        currentBalance: register.current_balance,
        expectedBalance: register.expected_balance
      }));
      
      setRegisters(formattedRegisters);
    } catch (err) {
      console.error('Error fetching registers:', err);
      setError(err as Error);
      toast.error('Failed to load registers');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registers,
    isLoading,
    error,
    refresh: fetchRegisters
  };
};
