
import { differenceInDays, parseISO, isValid } from 'date-fns';

export type BatchStatus = 'fresh' | 'expiring_soon' | 'expired';

/**
 * Determine the status of a product batch based on its expiry date
 * @param expiryDateStr ISO date string of the expiry date
 * @returns Status of the batch - 'fresh', 'expiring_soon', or 'expired'
 */
export const getBatchStatus = (expiryDateStr: string): BatchStatus => {
  if (!expiryDateStr || !isValid(parseISO(expiryDateStr))) {
    console.warn('Invalid expiry date:', expiryDateStr);
    return 'expired';
  }
  
  const expiryDate = parseISO(expiryDateStr);
  const today = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, today);
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring_soon';
  } else {
    return 'fresh';
  }
};

/**
 * Format the days until expiry (or since expiry) as a human-readable string
 * @param expiryDateStr ISO date string of the expiry date
 * @returns Formatted string like "Expires in 5 days" or "Expired 10 days ago"
 */
export const formatDaysUntilExpiry = (expiryDateStr: string): string => {
  if (!expiryDateStr || !isValid(parseISO(expiryDateStr))) {
    return 'Invalid expiry date';
  }
  
  const expiryDate = parseISO(expiryDateStr);
  const today = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, today);
  
  if (daysUntilExpiry < 0) {
    return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
  } else if (daysUntilExpiry === 0) {
    return 'Expires today';
  } else if (daysUntilExpiry === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${daysUntilExpiry} days`;
  }
};
