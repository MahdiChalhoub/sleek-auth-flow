
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FinancialYear, FinancialYearFormData, FinancialYearStatus } from '@/models/interfaces/financialYearInterfaces';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [currentFinancialYear, setCurrentFinancialYear] = useState<FinancialYear | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFinancialYears = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('financial_years')
        .select('*')
        .order('startDate', { ascending: false });

      if (error) throw error;

      // Set the financial years
      setFinancialYears(data || []);

      // Find current financial year (year with status open that includes today's date)
      const today = new Date().toISOString().split('T')[0];
      const current = data?.find(year => 
        year.status === 'open' && 
        year.startDate <= today && 
        year.endDate >= today
      );

      setCurrentFinancialYear(current || null);
    } catch (err) {
      console.error('Error fetching financial years:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createFinancialYear = async (yearData: FinancialYearFormData) => {
    try {
      // Check for overlapping financial years
      const { data: overlapping } = await supabase
        .from('financial_years')
        .select('*')
        .or(`startDate.lte.${yearData.endDate},endDate.gte.${yearData.startDate}`);

      if (overlapping && overlapping.length > 0) {
        toast.error('Cannot create overlapping financial years');
        return false;
      }

      const { data, error } = await supabase
        .from('financial_years')
        .insert([{
          name: yearData.name,
          startDate: yearData.startDate,
          endDate: yearData.endDate,
          status: yearData.status,
          createdBy: user?.id || 'system',
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Financial year created successfully');
      fetchFinancialYears();
      return true;
    } catch (err) {
      console.error('Error creating financial year:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create financial year');
      return false;
    }
  };

  const updateFinancialYearStatus = async (id: string, status: FinancialYearStatus) => {
    try {
      const updateData: any = { status };
      
      // If closing the year, add closed information
      if (status === 'closed') {
        updateData.closedBy = user?.id || 'system';
        updateData.closedAt = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('financial_years')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      // Get the updated year for the toast message
      const { data: updatedYear } = await supabase
        .from('financial_years')
        .select('name')
        .eq('id', id)
        .single();
      
      toast.success(`Financial year ${updatedYear?.name} ${status === 'closed' ? 'closed' : status === 'locked' ? 'locked' : 'reopened'} successfully`);
      fetchFinancialYears();
      return true;
    } catch (err) {
      console.error(`Error ${status} financial year:`, err);
      toast.error(err instanceof Error ? err.message : `Failed to update financial year status`);
      return false;
    }
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  return {
    financialYears,
    currentFinancialYear,
    isLoading,
    error,
    createFinancialYear,
    updateFinancialYearStatus,
    refreshFinancialYears: fetchFinancialYears
  };
};
