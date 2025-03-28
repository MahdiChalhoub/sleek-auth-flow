
import { parseISO, differenceInDays } from 'date-fns';

export type BatchStatus = 'fresh' | 'expiring_soon' | 'expired';

/**
 * Determines the status of a batch based on its expiry date
 * @param expiryDate ISO date string of the batch expiry date
 * @returns Status of the batch: 'fresh', 'expiring_soon', or 'expired'
 */
export const getBatchStatus = (expiryDate: string | null): BatchStatus => {
  if (!expiryDate) return 'expired';
  
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
 * Get appropriate color class for a batch status
 * @param status The batch status
 * @returns Tailwind CSS color class
 */
export const getBatchStatusColor = (status: BatchStatus): string => {
  switch (status) {
    case 'fresh':
      return 'text-green-600 border-green-300 bg-green-50';
    case 'expiring_soon':
      return 'text-amber-600 border-amber-300 bg-amber-50';
    case 'expired':
      return 'text-red-600 border-red-300 bg-red-50';
    default:
      return 'text-gray-600 border-gray-300 bg-gray-50';
  }
};

/**
 * Format days until expiry with appropriate text
 * @param expiryDate ISO date string of the batch expiry date
 * @returns Formatted string describing days until expiry
 */
export const formatDaysUntilExpiry = (expiryDate: string | null): string => {
  if (!expiryDate) return 'No expiry date';
  
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
