
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Register } from '@/models/interfaces/registerInterfaces';
import { PaymentMethod } from '@/models/transaction';
import { DiscrepancyResolution } from '@/models/interfaces/registerInterfaces';
import { typeCast, rpcParams } from '@/utils/supabaseTypes';
import { useAuth } from '@/contexts/AuthContext';

// Interface for register service return type
export interface RegisterServiceReturn {
  register: Register | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  openRegister: (openingBalance: Record<PaymentMethod, number>) => Promise<void>;
  closeRegister: (closingBalance: Record<PaymentMethod, number>, expectedBalance: Record<PaymentMethod, number>) => Promise<void>;
  resolveDiscrepancy: (resolution: DiscrepancyResolution, notes: string) => Promise<void>;
}

// Function to update register properties
export const updateRegister = async (id: string, updates: Partial<Register>): Promise<Register> => {
  try {
    const { data, error } = await supabase
      .from('register_sessions')
      .update({
        ...updates,
        is_open: updates.isOpen,
        opened_at: updates.openedAt,
        closed_at: updates.closedAt,
        opened_by: updates.openedBy,
        closed_by: updates.closedBy,
        discrepancy_approved_at: updates.discrepancyApprovedAt,
        discrepancy_approved_by: updates.discrepancyApprovedBy,
        discrepancy_resolution: updates.discrepancyResolution,
        discrepancy_notes: updates.discrepancyNotes,
        discrepancies: updates.discrepancies,
        opening_balance: updates.openingBalance,
        current_balance: updates.currentBalance,
        expected_balance: updates.expectedBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    // Transform the data back to our Register model
    return {
      id: data.id,
      name: data.name,
      isOpen: data.is_open,
      openedAt: data.opened_at,
      closedAt: data.closed_at,
      openedBy: data.opened_by,
      closedBy: data.closed_by,
      discrepancyApprovedAt: data.discrepancy_approved_at,
      discrepancyApprovedBy: data.discrepancy_approved_by,
      discrepancyResolution: data.discrepancy_resolution as DiscrepancyResolution,
      discrepancyNotes: data.discrepancy_notes,
      discrepancies: data.discrepancies,
      openingBalance: data.opening_balance,
      currentBalance: data.current_balance,
      expectedBalance: data.expected_balance
    };
  } catch (error) {
    console.error('Error updating register:', error);
    throw error;
  }
};

export function useRegisterService(registerId?: string): RegisterServiceReturn {
  const [register, setRegister] = useState<Register | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchRegister = async () => {
    if (!registerId) {
      setRegister(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('register_sessions')
        .select('*')
        .eq('id', registerId)
        .single();

      if (error) throw error;

      setRegister({
        id: data.id,
        name: data.name,
        isOpen: data.is_open,
        openedAt: data.opened_at,
        closedAt: data.closed_at,
        openedBy: data.opened_by,
        closedBy: data.closed_by,
        discrepancyApprovedAt: data.discrepancy_approved_at,
        discrepancyApprovedBy: data.discrepancy_approved_by,
        discrepancyResolution: data.discrepancy_resolution as DiscrepancyResolution,
        discrepancyNotes: data.discrepancy_notes,
        discrepancies: data.discrepancies,
        openingBalance: data.opening_balance,
        currentBalance: data.current_balance,
        expectedBalance: data.expected_balance
      });
    } catch (err) {
      console.error('Error fetching register:', err);
      setError(err as Error);
      toast.error('Failed to load register');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegister();
  }, [registerId]);

  const openRegister = async (openingBalance: Record<PaymentMethod, number>) => {
    if (!registerId || !user) {
      toast.error('Cannot open register: Missing register ID or user');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('open_register', typeCast({
          register_id: registerId,
          user_id: user.id,
          opening_balance: openingBalance
        }));

      if (error) throw error;

      toast.success('Register opened successfully');
      await fetchRegister();
    } catch (err) {
      console.error('Error opening register:', err);
      setError(err as Error);
      toast.error('Failed to open register');
    } finally {
      setIsLoading(false);
    }
  };

  const closeRegister = async (
    closingBalance: Record<PaymentMethod, number>,
    expectedBalance: Record<PaymentMethod, number>
  ) => {
    if (!registerId || !user || !register?.isOpen) {
      toast.error('Cannot close register: Register is not open or missing data');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('close_register', typeCast({
          register_id: registerId,
          user_id: user.id,
          closing_balance: closingBalance,
          expected_balance: expectedBalance
        }));

      if (error) throw error;

      toast.success('Register closed successfully');
      await fetchRegister();
    } catch (err) {
      console.error('Error closing register:', err);
      setError(err as Error);
      toast.error('Failed to close register');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveDiscrepancy = async (resolution: DiscrepancyResolution, notes: string) => {
    if (!registerId || !user || register?.isOpen) {
      toast.error('Cannot resolve discrepancy: Register is still open or missing data');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('resolve_register_discrepancy', typeCast({
          register_id: registerId,
          user_id: user.id,
          resolution: resolution,
          notes: notes
        }));

      if (error) throw error;

      toast.success('Discrepancy resolved successfully');
      await fetchRegister();
    } catch (err) {
      console.error('Error resolving discrepancy:', err);
      setError(err as Error);
      toast.error('Failed to resolve discrepancy');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    refresh: fetchRegister,
    openRegister,
    closeRegister,
    resolveDiscrepancy
  };
}
