
import { useState, useEffect } from 'react';
import { FinancialYear, FinancialYearFormData, FinancialYearStatus } from '@/models/interfaces/financialYearInterfaces';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Mock financial years for development
const mockFinancialYears: FinancialYear[] = [
  {
    id: 'fy-2023',
    name: 'Financial Year 2023',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'closed',
    createdBy: 'user-1',
    createdAt: '2022-12-15T00:00:00Z',
    updatedAt: '2023-12-31T00:00:00Z',
    closedBy: 'user-1',
    closedAt: '2023-12-31T00:00:00Z'
  },
  {
    id: 'fy-2024',
    name: 'Financial Year 2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    createdBy: 'user-1',
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export function useFinancialYears() {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>(mockFinancialYears);
  const [currentFinancialYear, setCurrentFinancialYear] = useState<FinancialYear>(
    mockFinancialYears.find(fy => fy.status === 'active') || mockFinancialYears[0]
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load financial years from API
    // This is a placeholder - replace with actual API call
  }, []);

  const createFinancialYear = async (data: Omit<FinancialYearFormData, 'createdBy'>) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const newFY: FinancialYear = {
        id: `fy-${Math.random().toString(36).substring(2, 9)}`,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        createdBy: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setFinancialYears(prev => [...prev, newFY]);
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
      // Update the status of the current active financial year to 'open'
      setFinancialYears(prev => 
        prev.map(fy => 
          fy.status === 'active' ? { ...fy, status: 'open' as FinancialYearStatus } : fy
        )
      );
      
      // Set the selected financial year as active
      setFinancialYears(prev => 
        prev.map(fy => 
          fy.id === id ? { ...fy, status: 'active' as FinancialYearStatus } : fy
        )
      );
      
      // Update the current financial year
      const updated = financialYears.find(fy => fy.id === id);
      if (updated) {
        setCurrentFinancialYear({ ...updated, status: 'active' });
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
      // Close the financial year
      setFinancialYears(prev => 
        prev.map(fy => 
          fy.id === id ? { 
            ...fy, 
            status: 'closed' as FinancialYearStatus,
            closedBy: user?.id,
            closedAt: new Date().toISOString()
          } : fy
        )
      );
      
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
      // Reopen the financial year
      setFinancialYears(prev => 
        prev.map(fy => 
          fy.id === id ? { 
            ...fy, 
            status: 'open' as FinancialYearStatus,
            closedBy: undefined,
            closedAt: undefined
          } : fy
        )
      );
      
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
      // Update the financial year status
      setFinancialYears(prev => 
        prev.map(fy => 
          fy.id === id ? { ...fy, status } : fy
        )
      );
      
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
