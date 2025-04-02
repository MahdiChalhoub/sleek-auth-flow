
import { useState } from 'react';
import { toast } from 'sonner';

interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Mock financial years
const mockFinancialYears: FinancialYear[] = [
  {
    id: 'fy-2023',
    name: 'FY 2023',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    isCurrent: true,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'fy-2022',
    name: 'FY 2022',
    startDate: '2022-01-01T00:00:00Z',
    endDate: '2022-12-31T23:59:59Z',
    isCurrent: false,
    status: 'closed',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2022-12-31T23:59:59Z'
  }
];

export const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>(mockFinancialYears);
  const [loading, setLoading] = useState(false);
  
  // Get current financial year
  const currentFinancialYear = financialYears.find(fy => fy.isCurrent);
  
  // Create a new financial year
  const createFinancialYear = async (data: Omit<FinancialYear, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const now = new Date().toISOString();
      const newFinancialYear: FinancialYear = {
        ...data,
        id: `fy-${new Date().getTime()}`,
        createdAt: now,
        updatedAt: now
      };
      
      // If the new financial year is set as current, update other financial years
      if (newFinancialYear.isCurrent) {
        setFinancialYears(prev => 
          prev.map(fy => ({
            ...fy,
            isCurrent: false
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
      setLoading(false);
    }
  };
  
  // Set a financial year as current
  const setCurrentFinancialYear = async (id: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setFinancialYears(prev => 
        prev.map(fy => ({
          ...fy,
          isCurrent: fy.id === id
        }))
      );
      toast.success('Current financial year updated');
    } catch (error) {
      toast.error('Failed to update current financial year');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Close a financial year
  const closeFinancialYear = async (id: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setFinancialYears(prev => 
        prev.map(fy => {
          if (fy.id === id) {
            return {
              ...fy,
              status: 'closed' as const,
              updatedAt: new Date().toISOString()
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
      setLoading(false);
    }
  };
  
  return {
    financialYears,
    currentFinancialYear,
    loading,
    createFinancialYear,
    setCurrentFinancialYear,
    closeFinancialYear
  };
};
