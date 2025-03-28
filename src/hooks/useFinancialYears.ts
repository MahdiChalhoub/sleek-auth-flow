
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FinancialYear, FinancialYearStatus } from '@/models/interfaces/financialYearInterfaces';
import { toast } from 'sonner';

// Fetch all financial years
const fetchFinancialYears = async (): Promise<FinancialYear[]> => {
  const { data, error } = await supabase
    .from('financial_years')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((year: any) => ({
    id: year.id,
    name: year.name,
    startDate: year.start_date,
    endDate: year.end_date,
    status: year.status as FinancialYearStatus,
    createdBy: year.created_by,
    createdAt: year.created_at,
    updatedAt: year.updated_at,
    closedAt: year.closed_at,
    closedBy: year.closed_by
  }));
};

// Fetch a single financial year by ID
const fetchFinancialYearById = async (id: string): Promise<FinancialYear> => {
  const { data, error } = await supabase
    .from('financial_years')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status as FinancialYearStatus,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    closedBy: data.closed_by
  };
};

// Create a new financial year
const createFinancialYear = async (financialYear: Omit<FinancialYear, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialYear> => {
  const { data, error } = await supabase
    .from('financial_years')
    .insert([
      {
        name: financialYear.name,
        start_date: financialYear.startDate,
        end_date: financialYear.endDate,
        status: financialYear.status,
        created_by: financialYear.createdBy
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status as FinancialYearStatus,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    closedBy: data.closed_by
  };
};

// Update a financial year
const updateFinancialYear = async (
  id: string,
  updates: Partial<FinancialYear>
): Promise<FinancialYear> => {
  const dbUpdates: any = {};
  
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.startDate) dbUpdates.start_date = updates.startDate;
  if (updates.endDate) dbUpdates.end_date = updates.endDate;
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.closedBy) dbUpdates.closed_by = updates.closedBy;
  if (updates.closedAt) dbUpdates.closed_at = updates.closedAt;

  const { data, error } = await supabase
    .from('financial_years')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status as FinancialYearStatus,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    closedBy: data.closed_by
  };
};

// Update a financial year's status
const updateFinancialYearStatus = async ({ 
  id, 
  status,
  closedBy 
}: { 
  id: string;
  status: FinancialYearStatus;
  closedBy?: string;
}): Promise<FinancialYear> => {
  const updates: any = {
    status
  };

  // If we're closing the financial year, add closed_at and closed_by
  if (status === 'closed' && closedBy) {
    updates.closed_at = new Date().toISOString();
    updates.closed_by = closedBy;
  }

  const { data, error } = await supabase
    .from('financial_years')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status as FinancialYearStatus,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    closedBy: data.closed_by
  };
};

// Delete a financial year
const deleteFinancialYear = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('financial_years')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

// Close a financial year
const closeFinancialYear = async (id: string, userId?: string): Promise<FinancialYear> => {
  return updateFinancialYearStatus({
    id,
    status: 'closed',
    closedBy: userId
  });
};

// Reopen a financial year
const reopenFinancialYear = async (id: string): Promise<FinancialYear> => {
  return updateFinancialYearStatus({
    id,
    status: 'open'
  });
};

// Custom hook to manage financial years
export const useFinancialYears = () => {
  const queryClient = useQueryClient();

  // Get all financial years
  const {
    data: financialYears = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['financialYears'],
    queryFn: fetchFinancialYears
  });

  // Get current active financial year
  const currentFinancialYear = financialYears.find(fy => fy.status === 'active' || fy.status === 'open');
  const activeYear = currentFinancialYear;

  // Create a new financial year
  const createMutation = useMutation({
    mutationFn: createFinancialYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialYears'] });
      toast.success('Financial year created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating financial year: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Update a financial year
  const updateMutation = useMutation({
    mutationFn: (params: { id: string; updates: Partial<FinancialYear> }) => 
      updateFinancialYear(params.id, params.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialYears'] });
      toast.success('Financial year updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating financial year: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Update a financial year's status
  const updateStatusMutation = useMutation({
    mutationFn: updateFinancialYearStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialYears'] });
      toast.success('Financial year status updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating financial year status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Close a financial year
  const closeMutation = useMutation({
    mutationFn: (id: string) => closeFinancialYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialYears'] });
      toast.success('Financial year closed successfully');
    },
    onError: (error) => {
      toast.error(`Error closing financial year: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Reopen a financial year
  const reopenMutation = useMutation({
    mutationFn: reopenFinancialYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialYears'] });
      toast.success('Financial year reopened successfully');
    },
    onError: (error) => {
      toast.error(`Error reopening financial year: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Delete a financial year
  const deleteMutation = useMutation({
    mutationFn: deleteFinancialYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialYears'] });
      toast.success('Financial year deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting financial year: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    financialYears,
    currentFinancialYear,
    activeYear,
    isLoading,
    error,
    createFinancialYear: createMutation.mutate,
    updateFinancialYear: (id: string, updates: Partial<FinancialYear>) => 
      updateMutation.mutate({ id, updates }),
    updateFinancialYearStatus: updateStatusMutation.mutate,
    closeFinancialYear: closeMutation.mutate,
    reopenFinancialYear: reopenMutation.mutate,
    deleteFinancialYear: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};

// Fix the export to use 'export type' instead of just 'export'
export type { FinancialYearStatus };
export default useFinancialYears;
