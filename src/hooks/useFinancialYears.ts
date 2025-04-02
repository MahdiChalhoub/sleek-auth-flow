
import { useState } from 'react';
import { toast } from 'sonner';
import { FinancialYear, FinancialYearStatus } from '@/models/interfaces/financialYearInterfaces';

// Mock financial years
const mockFinancialYears: FinancialYear[] = [
  {
    id: 'fy-2023',
    name: 'FY 2023',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    status: 'active',
    createdBy: 'System Admin',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'fy-2022',
    name: 'FY 2022',
    startDate: '2022-01-01T00:00:00Z',
    endDate: '2022-12-31T23:59:59Z',
    status: 'closed',
    createdBy: 'System Admin',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2022-12-31T23:59:59Z',
    closedBy: 'System Admin',
    closedAt: '2022-12-31T23:59:59Z'
  }
];

export const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>(mockFinancialYears);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get current financial year
  const currentFinancialYear = financialYears.find(fy => fy.status === 'active');
  
  // Create a new financial year
  const createFinancialYear = async (data: Omit<FinancialYearFormData, "createdBy"> & { createdBy: string }) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const now = new Date().toISOString();
      const newFinancialYear: FinancialYear = {
        ...data,
        id: `fy-${new Date().getTime()}`,
        createdAt: now,
        updatedAt: now,
        status: data.status || 'open'
      };
      
      // If the new financial year is set as current, update other financial years
      if (newFinancialYear.status === 'active') {
        setFinancialYears(prev => 
          prev.map(fy => ({
            ...fy,
            status: fy.status === 'active' ? 'closed' : fy.status
          }))
        );
      }
      
      setFinancialYears(prev => [...prev, newFinancialYear]);
      toast.success('Financial year created successfully');
      return newFinancialYear;
    } catch (error) {
      toast.error('Failed to create financial year');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set a financial year as current/active
  const setCurrentFinancialYear = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      setFinancialYears(prev => 
        prev.map(fy => ({
          ...fy,
          status: fy.id === id ? 'active' : (fy.status === 'active' ? 'closed' : fy.status)
        }))
      );
      toast.success('Current financial year updated');
    } catch (error) {
      toast.error('Failed to update current financial year');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Close a financial year
  const closeFinancialYear = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      setFinancialYears(prev => 
        prev.map(fy => {
          if (fy.id === id) {
            return {
              ...fy,
              status: 'closed' as const,
              updatedAt: new Date().toISOString(),
              closedAt: new Date().toISOString(),
              closedBy: "Current User" // This would be the actual user in a real app
            };
          }
          return fy;
        })
      );
      toast.success('Financial year closed');
    } catch (error) {
      toast.error('Failed to close financial year');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reopen a financial year
  const reopenFinancialYear = async (id: string) => {
    setIsLoading(true);
    try {
      // Check if there's already an active financial year
      const hasActive = financialYears.some(fy => fy.status === 'active' && fy.id !== id);
      
      if (hasActive) {
        toast.error('Cannot reopen: Another financial year is already active');
        return;
      }
      
      setFinancialYears(prev => 
        prev.map(fy => {
          if (fy.id === id) {
            return {
              ...fy,
              status: 'open' as const,
              updatedAt: new Date().toISOString(),
              // Clear closed information
              closedAt: undefined,
              closedBy: undefined
            };
          }
          return fy;
        })
      );
      toast.success('Financial year reopened');
    } catch (error) {
      toast.error('Failed to reopen financial year');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update financial year status
  const updateFinancialYearStatus = async (id: string, status: FinancialYearStatus) => {
    setIsLoading(true);
    try {
      if (status === 'active') {
        // Make sure only one financial year is active
        setFinancialYears(prev => 
          prev.map(fy => ({
            ...fy,
            status: fy.id === id ? 'active' : (fy.status === 'active' ? 'closed' : fy.status)
          }))
        );
      } else {
        setFinancialYears(prev => 
          prev.map(fy => {
            if (fy.id === id) {
              return {
                ...fy,
                status,
                updatedAt: new Date().toISOString(),
                ...(status === 'closed' && { 
                  closedAt: new Date().toISOString(),
                  closedBy: "Current User" 
                })
              };
            }
            return fy;
          })
        );
      }
      toast.success(`Financial year status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update financial year status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    financialYears,
    currentFinancialYear,
    isLoading,
    createFinancialYear,
    setCurrentFinancialYear,
    closeFinancialYear,
    reopenFinancialYear,
    updateFinancialYearStatus
  };
};
