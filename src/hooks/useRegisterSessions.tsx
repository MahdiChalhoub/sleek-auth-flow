
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Register } from '@/models/transaction';
import { fetchRegisters, getRegisterById, createRegister, updateRegister } from './register/registerService';
import { openRegister, closeRegister, resolveDiscrepancy } from './register/registerOperations';
import { DatabaseRegister } from './register/mappers';

export type { DatabaseRegister } from './register/mappers';

export const useRegisterSessions = () => {
  const queryClient = useQueryClient();

  const { data: registers = [], isLoading, error } = useQuery({
    queryKey: ['registerSessions'],
    queryFn: fetchRegisters
  });

  const createRegisterMutation = useMutation({
    mutationFn: createRegister,
    onSuccess: () => {
      toast.success('Register created successfully');
      queryClient.invalidateQueries({ queryKey: ['registerSessions'] });
    }
  });

  const updateRegisterMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Register> }) => {
      return updateRegister(id, updates);
    },
    onSuccess: () => {
      toast.success('Register updated successfully');
      queryClient.invalidateQueries({ queryKey: ['registerSessions'] });
    }
  });

  return {
    registers,
    getRegisterById,
    createRegister: createRegisterMutation.mutate,
    updateRegister: updateRegisterMutation.mutate,
    openRegister,
    closeRegister,
    resolveDiscrepancy,
    isLoading,
    error
  };
};
