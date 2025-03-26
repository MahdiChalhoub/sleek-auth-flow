
import { addDays, parseISO, differenceInDays } from 'date-fns';

export type BatchStatus = 'fresh' | 'expiring_soon' | 'expired';

export const WARNING_DAYS = 30; // Days before expiry to show warning

export const getBatchStatus = (expiryDate: string | null): BatchStatus => {
  if (!expiryDate) return 'fresh';
  
  const today = new Date();
  const expiry = parseISO(expiryDate);
  
  if (expiry < today) {
    return 'expired';
  }
  
  const daysUntilExpiry = differenceInDays(expiry, today);
  
  if (daysUntilExpiry <= WARNING_DAYS) {
    return 'expiring_soon';
  }
  
  return 'fresh';
};

export const getExpiryStatusPercentage = (expiryDate: string | null): number => {
  if (!expiryDate) return 100;
  
  const today = new Date();
  const expiry = parseISO(expiryDate);
  
  if (expiry < today) {
    return 0; // Expired
  }
  
  const daysUntilExpiry = differenceInDays(expiry, today);
  
  if (daysUntilExpiry > WARNING_DAYS) {
    return 100; // Fresh
  }
  
  // Calculate percentage for expiring soon (0-100)
  return Math.round((daysUntilExpiry / WARNING_DAYS) * 100);
};
