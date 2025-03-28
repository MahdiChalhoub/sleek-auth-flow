import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type FinancialYearStatus = 'open' | 'closed';

export interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
  createdBy: string;
  closedBy?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Map database column names to interface property names
const mapDbFinancialYearToModel = (dbYear: any): FinancialYear => {
  return {
    id: dbYear.id,
    name: dbYear.name,
    startDate: dbYear.start_date,
    endDate: dbYear.end_date,
    status: dbYear.status as FinancialYearStatus,
    createdBy: dbYear.created_by,
    closedBy: dbYear.closed_by,
    closedAt: dbYear.closed_at,
    createdAt: dbYear.created_at,
    updatedAt: dbYear.updated_at
  };
};

// Map interface property names to database column names
const mapModelFinancialYearToDb = (year: Partial<FinancialYear>): any => {
  return {
    name: year.name,
    start_date: year.startDate,
    end_date: year.endDate,
    status: year.status,
    created_by: year.createdBy,
    closed_by: year.closedBy,
    closed_at: year.closedAt
  };
};

export const useFinancialYears = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeYear, setActiveYear] = useState<FinancialYear | null>(null);

  // Fetch financial years
  const { data: financialYears = [], isLoading, refetch: fetchFinancialYears } = useQuery({
    queryKey: ['financial-years'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('financial_years')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (error) throw error;
        
        const mappedYears = data.map(mapDbFinancialYearToModel);
        
        // Set the active financial year (first open one, or most recent)
        const openYear = mappedYears.find(year => year.status === 'open');
        if (openYear && !activeYear) {
          setActiveYear(openYear);
        } else if (!activeYear && mappedYears.length > 0) {
          setActiveYear(mappedYears[0]);
        }
        
        return mappedYears;
      } catch (error) {
        console.error('Error fetching financial years:', error);
        toast.error('Failed to load financial years');
        return [];
      }
    }
  });
  
  // Create financial year
  const createFinancialYear = useMutation({
    mutationFn: async (yearData: Omit<FinancialYear, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        // Check for overlap with existing financial years
        const { data: existingYears, error: fetchError } = await supabase
          .from('financial_years')
          .select('*');
        
        if (fetchError) throw fetchError;
        
        const startDate = new Date(yearData.startDate);
        const endDate = new Date(yearData.endDate);
        
        const hasOverlap = existingYears.some((existingYear: any) => {
          const existingStartDate = new Date(existingYear.start_date);
          const existingEndDate = new Date(existingYear.end_date);
          
          return (
            (startDate >= existingStartDate && startDate <= existingEndDate) ||
            (endDate >= existingStartDate && endDate <= existingEndDate) ||
            (startDate <= existingStartDate && endDate >= existingEndDate)
          );
        });
        
        if (hasOverlap) {
          throw new Error('The new financial year overlaps with an existing financial year.');
        }
        
        const dbYearData = mapModelFinancialYearToDb(yearData);
        
        const { data, error } = await supabase
          .from('financial_years')
          .insert(dbYearData)
          .select()
          .single();
        
        if (error) throw error;
        
        return mapDbFinancialYearToModel(data);
      } catch (error: any) {
        console.error('Error creating financial year:', error);
        toast.error(`Failed to create financial year: ${error.message}`);
        throw error;
      }
    },
    onSuccess: (newYear) => {
      toast.success('Financial year created successfully');
      queryClient.invalidateQueries({ queryKey: ['financial-years'] });
      
      // If this is the first financial year or it's open, set it as active
      if (!activeYear || newYear.status === 'open') {
        setActiveYear(newYear);
      }
    }
  });
  
  // Close financial year
  const closeFinancialYear = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data, error } = await supabase
          .from('financial_years')
          .update({
            status: 'closed',
            closed_by: user?.email || 'system',
            closed_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        return mapDbFinancialYearToModel(data);
      } catch (error: any) {
        console.error('Error closing financial year:', error);
        toast.error(`Failed to close financial year: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Financial year closed successfully');
      queryClient.invalidateQueries({ queryKey: ['financial-years'] });
    }
  });
  
  // Reopen financial year
  const reopenFinancialYear = useMutation({
    mutationFn: async (id: string) => {
      try {
        // First, check if there's already an open financial year
        const { data: existingYears, error: fetchError } = await supabase
          .from('financial_years')
          .select('*')
          .eq('status', 'open');
        
        if (fetchError) throw fetchError;
        
        if (existingYears.length > 0) {
          throw new Error('Cannot reopen this financial year as another financial year is already open.');
        }
        
        const { data, error } = await supabase
          .from('financial_years')
          .update({
            status: 'open',
            closed_by: null,
            closed_at: null
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        return mapDbFinancialYearToModel(data);
      } catch (error: any) {
        console.error('Error reopening financial year:', error);
        toast.error(`Failed to reopen financial year: ${error.message}`);
        throw error;
      }
    },
    onSuccess: (reopenedYear) => {
      toast.success('Financial year reopened successfully');
      queryClient.invalidateQueries({ queryKey: ['financial-years'] });
      setActiveYear(reopenedYear);
    }
  });
  
  // Update financial year status
  const updateFinancialYearStatus = useMutation({
    mutationFn: async (id: string, status: FinancialYearStatus) => {
      try {
        // If trying to open a year, check if there's already an open year
        if (status === 'open') {
          const { data: openYears, error: fetchError } = await supabase
            .from('financial_years')
            .select('*')
            .eq('status', 'open');
          
          if (fetchError) throw fetchError;
          
          if (openYears.length > 0 && openYears[0].id !== id) {
            throw new Error('Cannot open this financial year as another financial year is already open.');
          }
        }
        
        const updateData: any = {
          status
        };
        
        // If closing, add closed_by and closed_at
        if (status === 'closed') {
          updateData.closed_by = user?.email || 'system';
          updateData.closed_at = new Date().toISOString();
        } else {
          // If opening, clear closed_by and closed_at
          updateData.closed_by = null;
          updateData.closed_at = null;
        }
        
        const { data, error } = await supabase
          .from('financial_years')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        return mapDbFinancialYearToModel(data);
      } catch (error: any) {
        console.error('Error updating financial year status:', error);
        toast.error(`Failed to update financial year status: ${error.message}`);
        throw error;
      }
    },
    onSuccess: (updatedYear) => {
      toast.success('Financial year status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['financial-years'] });
      
      // If the updated year is now open, set it as active
      if (updatedYear.status === 'open') {
        setActiveYear(updatedYear);
      } 
      // If the active year was closed, find a new active year
      else if (activeYear?.id === updatedYear.id && updatedYear.status === 'closed') {
        const openYear = financialYears.find(y => y.id !== updatedYear.id && y.status === 'open');
        if (openYear) {
          setActiveYear(openYear);
        } else {
          // Otherwise use the most recent one
          const mostRecent = financialYears.length > 0 ? financialYears[0] : null;
          setActiveYear(mostRecent);
        }
      }
    }
  });
  
  return {
    financialYears,
    activeYear,
    isLoading,
    fetchFinancialYears,
    createFinancialYear: createFinancialYear.mutate,
    closeFinancialYear: closeFinancialYear.mutate,
    reopenFinancialYear: reopenFinancialYear.mutate,
    updateFinancialYearStatus: updateFinancialYearStatus.mutate
  };
};
