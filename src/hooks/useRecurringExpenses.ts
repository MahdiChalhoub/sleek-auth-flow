
import { useState, useCallback } from 'react';
import { RecurringExpense, mockRecurringExpenses, PaymentMethod } from '@/models/payment';
import { toast } from 'sonner';

export const useRecurringExpenses = () => {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(mockRecurringExpenses);
  const [isLoading, setIsLoading] = useState(false);

  const getActiveRecurringExpenses = useCallback(() => {
    return recurringExpenses.filter(expense => expense.isActive);
  }, [recurringExpenses]);

  const getUpcomingExpenses = useCallback((days: number = 30) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    return recurringExpenses
      .filter(expense => expense.isActive)
      .map(expense => {
        // Calculate next occurrence based on frequency and last processed date
        let nextDate = new Date(expense.lastProcessedDate || expense.startDate);
        
        switch (expense.frequency) {
          case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
          case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
          case 'custom':
            if (expense.customDays) {
              nextDate.setDate(nextDate.getDate() + expense.customDays);
            }
            break;
        }
        
        // Check if the next occurrence falls within our date range
        if (nextDate >= today && nextDate <= futureDate) {
          return {
            ...expense,
            nextOccurrence: nextDate.toISOString()
          };
        }
        return null;
      })
      .filter(Boolean) as (RecurringExpense & { nextOccurrence: string })[];
  }, [recurringExpenses]);

  const addRecurringExpense = useCallback(async (expense: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newExpense: RecurringExpense = {
        ...expense,
        id: `rec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setRecurringExpenses(prev => [...prev, newExpense]);
      toast.success(`Recurring expense "${expense.title}" created successfully`);
      return newExpense;
    } catch (error) {
      toast.error('Failed to create recurring expense');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRecurringExpense = useCallback(async (id: string, updates: Partial<RecurringExpense>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRecurringExpenses(prev => 
        prev.map(expense => 
          expense.id === id 
            ? { ...expense, ...updates, updatedAt: new Date().toISOString() } 
            : expense
        )
      );
      
      toast.success('Recurring expense updated successfully');
    } catch (error) {
      toast.error('Failed to update recurring expense');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleRecurringExpense = useCallback(async (id: string, isActive: boolean) => {
    try {
      await updateRecurringExpense(id, { isActive });
      toast.success(`Recurring expense ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling recurring expense:', error);
    }
  }, [updateRecurringExpense]);

  const processOccurrence = useCallback(async (id: string, paymentMethod?: PaymentMethod) => {
    setIsLoading(true);
    try {
      // Simulate API call for processing a payment
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Update the last processed date
      setRecurringExpenses(prev => 
        prev.map(expense => 
          expense.id === id 
            ? { 
                ...expense, 
                lastProcessedDate: new Date().toISOString(),
                updatedAt: new Date().toISOString() 
              } 
            : expense
        )
      );
      
      toast.success('Expense occurrence processed successfully');
    } catch (error) {
      toast.error('Failed to process expense occurrence');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    recurringExpenses,
    isLoading,
    getActiveRecurringExpenses,
    getUpcomingExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    toggleRecurringExpense,
    processOccurrence
  };
};
