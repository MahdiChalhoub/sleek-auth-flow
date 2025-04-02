
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Register, DiscrepancyResolution } from '@/models/interfaces/registerInterfaces';
import { PaymentMethod } from '@/models/transaction';

export function useRegisterSessions() {
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to our Register model
      const transformedRegisters: Register[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        isOpen: item.is_open,
        openedAt: item.opened_at,
        closedAt: item.closed_at,
        openedBy: item.opened_by,
        closedBy: item.closed_by,
        discrepancyApprovedAt: item.discrepancy_approved_at,
        discrepancyApprovedBy: item.discrepancy_approved_by,
        discrepancyResolution: item.discrepancy_resolution as DiscrepancyResolution,
        discrepancyNotes: item.discrepancy_notes,
        discrepancies: item.discrepancies as unknown as Record<PaymentMethod, number>,
        openingBalance: item.opening_balance as unknown as Record<PaymentMethod, number>,
        currentBalance: item.current_balance as unknown as Record<PaymentMethod, number>,
        expectedBalance: item.expected_balance as unknown as Record<PaymentMethod, number>
      }));

      setRegisters(transformedRegisters);
    } catch (err) {
      console.error('Error fetching registers:', err);
      setError(err as Error);
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
}
