
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@/types/auth';
import { AuthContextType } from '@/types/auth';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext'; 
import { useAuth } from '@/contexts/AuthContext';
import { FinancialYear, FinancialYearStatus, FinancialYearFormData } from '@/models/interfaces/financialYearInterfaces';

export const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [activeYear, setActiveYear] = useState<FinancialYear | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchFinancialYears = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      // Map the database response to our FinancialYear interface
      const transformedData: FinancialYear[] = data.map(item => ({
        id: item.id,
        name: item.name,
        startDate: item.start_date,
        endDate: item.end_date,
        status: item.status as FinancialYearStatus,
        createdBy: item.created_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        closedBy: item.closed_by,
        closedAt: item.closed_at
      }));

      setFinancialYears(transformedData);

      // Set the active financial year (first open one or the most recent one)
      const openYear = transformedData.find(y => y.status === 'open');
      setActiveYear(openYear || (transformedData.length > 0 ? transformedData[0] : null));
    } catch (error) {
      console.error('Error fetching financial years:', error);
      toast.error('Failed to load financial years');
    } finally {
      setIsLoading(false);
    }
  };

  const createFinancialYear = async (yearData: Omit<FinancialYear, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_years')
        .insert([{
          name: yearData.name,
          start_date: yearData.startDate,
          end_date: yearData.endDate,
          status: yearData.status,
          created_by: yearData.createdBy
        }])
        .select()
        .single();

      if (error) throw error;

      // Map the database response to our FinancialYear interface
      const newYear: FinancialYear = {
        id: data.id,
        name: data.name,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status as FinancialYearStatus,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        closedBy: data.closed_by,
        closedAt: data.closed_at
      };

      // Update the local state
      setFinancialYears(prev => [newYear, ...prev]);
      
      // If this is the first year or it's open, set it as active
      if (financialYears.length === 0 || newYear.status === 'open') {
        setActiveYear(newYear);
      }

      toast.success('Financial year created successfully');
      return newYear;
    } catch (error) {
      console.error('Error creating financial year:', error);
      toast.error('Failed to create financial year');
      throw error;
    }
  };

  const closeFinancialYear = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_years')
        .update({ status: 'closed', closed_by: user?.id || 'system', closed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Get the updated year for the toast message
      const { data: updatedYear } = await supabase
        .from('financial_years')
        .select('name')
        .eq('id', id)
        .single();
      
      toast.success(`Financial year ${updatedYear?.name} closed successfully`);
      fetchFinancialYears();
      return true;
    } catch (err) {
      console.error('Error closing financial year:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to close financial year');
      return false;
    }
  };

  const reopenFinancialYear = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_years')
        .update({ status: 'open' })
        .eq('id', id);

      if (error) throw error;

      // Get the updated year for the toast message
      const { data: updatedYear } = await supabase
        .from('financial_years')
        .select('name')
        .eq('id', id)
        .single();
      
      toast.success(`Financial year ${updatedYear?.name} reopened successfully`);
      fetchFinancialYears();
      return true;
    } catch (err) {
      console.error('Error reopening financial year:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to reopen financial year');
      return false;
    }
  };

  const updateFinancialYearStatus = async (id: string, status: FinancialYearStatus) => {
    try {
      const updateData: any = { status };
      
      // If closing the year, add closed information
      if (status === 'closed') {
        updateData.closed_by = user?.id || 'system';
        updateData.closed_at = new Date().toISOString();
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
      
      toast.success(`Financial year ${updatedYear?.name} ${status === 'closed' ? 'closed' : 'reopened'} successfully`);
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
    activeYear,
    isLoading,
    fetchFinancialYears,
    createFinancialYear,
    closeFinancialYear,
    reopenFinancialYear,
    updateFinancialYearStatus
  };
};

