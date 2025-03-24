import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Register, PaymentMethod, DiscrepancyResolution } from '@/models/transaction';

export interface DatabaseRegister {
  id: string;
  name: string;
  is_open: boolean;
  opened_at: string | null;
  closed_at: string | null;
  opened_by: string | null;
  closed_by: string | null;
  opening_balance: Record<PaymentMethod, number>;
  current_balance: Record<PaymentMethod, number>;
  expected_balance: Record<PaymentMethod, number>;
  discrepancies: Record<PaymentMethod, number> | null;
  discrepancy_resolution: DiscrepancyResolution | null;
  discrepancy_approved_by: string | null;
  discrepancy_approved_at: string | null;
  discrepancy_notes: string | null;
  created_at: string;
  updated_at: string;
}

const mapToAppModel = (dbRegister: DatabaseRegister): Register => {
  return {
    id: dbRegister.id,
    name: dbRegister.name,
    isOpen: dbRegister.is_open,
    openedAt: dbRegister.opened_at || undefined,
    closedAt: dbRegister.closed_at || undefined,
    openedBy: dbRegister.opened_by || undefined,
    closedBy: dbRegister.closed_by || undefined,
    openingBalance: dbRegister.opening_balance,
    currentBalance: dbRegister.current_balance,
    expectedBalance: dbRegister.expected_balance,
    discrepancies: dbRegister.discrepancies || undefined,
    discrepancyResolution: dbRegister.discrepancy_resolution || undefined,
    discrepancyApprovedBy: dbRegister.discrepancy_approved_by || undefined,
    discrepancyApprovedAt: dbRegister.discrepancy_approved_at || undefined,
    discrepancyNotes: dbRegister.discrepancy_notes || undefined
  };
};

const mapToDbModel = (register: Register): Partial<DatabaseRegister> => {
  return {
    name: register.name,
    is_open: register.isOpen,
    opened_at: register.openedAt,
    closed_at: register.closedAt,
    opened_by: register.openedBy,
    closed_by: register.closedBy,
    opening_balance: register.openingBalance,
    current_balance: register.currentBalance,
    expected_balance: register.expectedBalance,
    discrepancies: register.discrepancies || null,
    discrepancy_resolution: register.discrepancyResolution,
    discrepancy_approved_by: register.discrepancyApprovedBy,
    discrepancy_approved_at: register.discrepancyApprovedAt,
    discrepancy_notes: register.discrepancyNotes
  };
};

export const useRegisterSessions = () => {
  const queryClient = useQueryClient();

  const { data: registers = [], isLoading, error } = useQuery({
    queryKey: ['registerSessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('register_sessions')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        toast.error(`Error fetching register sessions: ${error.message}`);
        throw error;
      }
      
      return (data || []).map(register => mapToAppModel(register as DatabaseRegister));
    }
  });

  const getRegisterById = async (id: string): Promise<Register | null> => {
    const { data, error } = await supabase
      .from('register_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') {
        toast.error(`Error fetching register: ${error.message}`);
      }
      return null;
    }
    
    return mapToAppModel(data as DatabaseRegister);
  };

  const createRegister = useMutation({
    mutationFn: async (register: Omit<Register, 'id'>) => {
      const dbModel = mapToDbModel(register as Register);
      
      const { data, error } = await supabase
        .from('register_sessions')
        .insert([dbModel])
        .select()
        .single();
      
      if (error) {
        toast.error(`Error creating register: ${error.message}`);
        throw error;
      }
      
      return mapToAppModel(data as DatabaseRegister);
    },
    onSuccess: () => {
      toast.success('Register created successfully');
      queryClient.invalidateQueries({ queryKey: ['registerSessions'] });
    }
  });

  const updateRegister = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Register> }) => {
      const dbUpdates = mapToDbModel(updates as Register);
      
      const { data, error } = await supabase
        .from('register_sessions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        toast.error(`Error updating register: ${error.message}`);
        throw error;
      }
      
      return mapToAppModel(data as DatabaseRegister);
    },
    onSuccess: () => {
      toast.success('Register updated successfully');
      queryClient.invalidateQueries({ queryKey: ['registerSessions'] });
    }
  });

  const openRegister = async (id: string, openingBalance: Record<PaymentMethod, number>, openedBy: string = "Current User") => {
    return updateRegister.mutateAsync({
      id,
      updates: {
        isOpen: true,
        openedAt: new Date().toISOString(),
        openedBy,
        openingBalance,
        currentBalance: openingBalance
      }
    });
  };

  const closeRegister = async (
    id: string,
    closingBalance: Record<PaymentMethod, number>,
    expectedBalance: Record<PaymentMethod, number>,
    closedBy: string = "Current User"
  ) => {
    const discrepancies: Record<PaymentMethod, number> = {
      cash: closingBalance.cash - expectedBalance.cash,
      card: closingBalance.card - expectedBalance.card,
      bank: closingBalance.bank - expectedBalance.bank,
      wave: closingBalance.wave - expectedBalance.wave,
      mobile: closingBalance.mobile - expectedBalance.mobile,
      not_specified: closingBalance.not_specified - expectedBalance.not_specified
    };

    return updateRegister.mutateAsync({
      id,
      updates: {
        isOpen: false,
        closedAt: new Date().toISOString(),
        closedBy,
        currentBalance: closingBalance,
        discrepancies
      }
    });
  };

  const resolveDiscrepancy = async (
    id: string,
    resolution: DiscrepancyResolution,
    notes: string,
    approvedBy: string = "Admin User"
  ) => {
    return updateRegister.mutateAsync({
      id,
      updates: {
        discrepancyResolution: resolution,
        discrepancyNotes: notes,
        discrepancyApprovedBy: approvedBy,
        discrepancyApprovedAt: new Date().toISOString()
      }
    });
  };

  return {
    registers,
    getRegisterById,
    createRegister: createRegister.mutate,
    updateRegister: updateRegister.mutate,
    openRegister,
    closeRegister,
    resolveDiscrepancy,
    isLoading,
    error
  };
};
