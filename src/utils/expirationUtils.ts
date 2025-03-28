
import { parseISO, differenceInDays } from 'date-fns';

export type BatchStatus = 'fresh' | 'expiring_soon' | 'expired';

/**
 * Determines the status of a batch based on its expiry date
 * @param expiryDate ISO date string of the batch expiry date
 * @returns Status of the batch: 'fresh', 'expiring_soon', or 'expired'
 */
export const getBatchStatus = (expiryDate: string): BatchStatus => {
  const today = new Date();
  const expiryDateObj = parseISO(expiryDate);
  const daysUntilExpiry = differenceInDays(expiryDateObj, today);
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring_soon';
  } else {
    return 'fresh';
  }
};

/**
 * Format days until expiry with appropriate text
 * @param expiryDate ISO date string of the batch expiry date
 * @returns Formatted string describing days until expiry
 */
export const formatDaysUntilExpiry = (expiryDate: string): string => {
  const today = new Date();
  const expiryDateObj = parseISO(expiryDate);
  const daysUntilExpiry = differenceInDays(expiryDateObj, today);
  
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
