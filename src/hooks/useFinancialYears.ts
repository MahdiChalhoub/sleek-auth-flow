
import { useState, useEffect } from 'react';
import { FinancialYear, FinancialYearFormData, FinancialYearStatus } from '@/models/interfaces/financialYearInterfaces';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export function useFinancialYears() {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [currentFinancialYear, setCurrentFinancialYear] = useState<FinancialYear | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch financial years from the database
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('financial_years')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setFinancialYears(data);
          // Set current financial year to the active one, or the most recent
          const activeYear = data.find(fy => fy.status === 'active');
          setCurrentFinancialYear(activeYear || data[0]);
        } else {
          // If no data is found, don't set any financial years
          setFinancialYears([]);
          setCurrentFinancialYear(null);
        }
      } catch (error) {
        console.error('Error fetching financial years:', error);
        toast.error('Failed to load financial years');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialYears();
  }, []);

  const createFinancialYear = async (data: Omit<FinancialYearFormData, 'createdBy'>) => {
    try {
      setLoading(true);
      
      const newFY: FinancialYear = {
        id: uuidv4(),
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        createdBy: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('financial_years')
        .insert(newFY);
      
      if (error) throw error;
      
      // Refresh financial years after creation
      const { data: updatedData, error: fetchError } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      if (updatedData) {
        setFinancialYears(updatedData);
        
        if (newFY.status === 'active') {
          setCurrentFinancialYear(newFY);
        }
      }
      
      toast.success('Financial year created');
      return newFY;
    } catch (error) {
      console.error('Error creating financial year:', error);
      toast.error('Failed to create financial year');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setActiveFinancialYear = async (id: string) => {
    try {
      setLoading(true);
      
      // Update the status of current active financial year to 'pending'
      const currentActive = financialYears.find(fy => fy.status === 'active');
      if (currentActive) {
        const { error: updateError } = await supabase
          .from('financial_years')
          .update({ status: 'pending' as FinancialYearStatus })
          .eq('id', currentActive.id);
          
        if (updateError) throw updateError;
      }
      
      // Set the selected financial year as active
      const { error } = await supabase
        .from('financial_years')
        .update({ status: 'active' as FinancialYearStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh financial years after update
      const { data, error: fetchError } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      if (data) {
        setFinancialYears(data);
        const updated = data.find(fy => fy.id === id);
        if (updated) {
          setCurrentFinancialYear(updated);
        }
      }
      
      toast.success('Financial year activated');
      return true;
    } catch (error) {
      console.error('Error setting active financial year:', error);
      toast.error('Failed to set active financial year');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const closeFinancialYear = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('financial_years')
        .update({ 
          status: 'closed' as FinancialYearStatus,
          closedBy: user?.id,
          closedAt: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh financial years after update
      const { data, error: fetchError } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      if (data) {
        setFinancialYears(data);
        
        // If the closed year was the current one, update the current year
        if (currentFinancialYear && currentFinancialYear.id === id) {
          const activeYear = data.find(fy => fy.status === 'active');
          setCurrentFinancialYear(activeYear || data[0]);
        }
      }
      
      toast.success('Financial year closed');
      return true;
    } catch (error) {
      console.error('Error closing financial year:', error);
      toast.error('Failed to close financial year');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reopenFinancialYear = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('financial_years')
        .update({ 
          status: 'pending' as FinancialYearStatus,
          closedBy: null,
          closedAt: null
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh financial years after update
      const { data, error: fetchError } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      if (data) {
        setFinancialYears(data);
      }
      
      toast.success('Financial year reopened');
      return true;
    } catch (error) {
      console.error('Error reopening financial year:', error);
      toast.error('Failed to reopen financial year');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFinancialYearStatus = async (id: string, status: FinancialYearStatus) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('financial_years')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh financial years after update
      const { data, error: fetchError } = await supabase
        .from('financial_years')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      if (data) {
        setFinancialYears(data);
        
        // If status is 'active', update current financial year
        if (status === 'active') {
          const updated = data.find(fy => fy.id === id);
          if (updated) {
            setCurrentFinancialYear(updated);
          }
        } else if (currentFinancialYear && currentFinancialYear.id === id) {
          // If the updated year was the current one and it's no longer active
          const activeYear = data.find(fy => fy.status === 'active');
          setCurrentFinancialYear(activeYear || data[0]);
        }
      }
      
      toast.success(`Financial year status updated to ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating financial year status:', error);
      toast.error('Failed to update financial year status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    financialYears,
    currentFinancialYear,
    loading,
    isLoading: loading,
    createFinancialYear,
    setCurrentFinancialYear: setActiveFinancialYear,
    closeFinancialYear,
    reopenFinancialYear,
    updateFinancialYearStatus
  };
}

export default useFinancialYears;
