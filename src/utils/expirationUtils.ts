
import { differenceInDays, parseISO } from 'date-fns';

type BatchStatus = 'fresh' | 'expiring_soon' | 'expired';

/**
 * Determine the status of a batch based on its expiry date
 * @param expiryDateStr ISO Date string for expiry
 * @returns Status of the batch (fresh, expiring_soon, expired)
 */
export const getBatchStatus = (expiryDateStr: string | null): BatchStatus => {
  if (!expiryDateStr) {
    return 'fresh'; // Default to fresh if no expiry date
  }
  
  try {
    const expiryDate = parseISO(expiryDateStr);
    const daysUntilExpiry = differenceInDays(expiryDate, new Date());
    
    if (daysUntilExpiry < 0) {
      return 'expired';
    } else if (daysUntilExpiry <= 30) {
      return 'expiring_soon';
    } else {
      return 'fresh';
    }
  } catch (error) {
    console.error('Error parsing expiry date:', error);
    return 'fresh'; // Default to fresh if parsing fails
  }
};

/**
 * Get appropriate color for batch status badge
 * @param status Batch status
 * @returns Tailwind color class
 */
export const getBatchStatusColor = (status: BatchStatus): string => {
  switch (status) {
    case 'fresh':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'expiring_soon':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Format days until expiry for display
 * @param expiryDateStr ISO Date string for expiry
 * @returns Formatted string showing days until expiry
 */
export const formatDaysUntilExpiry = (expiryDateStr: string): string => {
  try {
    const expiryDate = parseISO(expiryDateStr);
    const daysUntilExpiry = differenceInDays(expiryDate, new Date());
    
    if (daysUntilExpiry < 0) {
      return `Expiré depuis ${Math.abs(daysUntilExpiry)} jours`;
    } else if (daysUntilExpiry === 0) {
      return 'Expire aujourd\'hui';
    } else if (daysUntilExpiry === 1) {
      return 'Expire demain';
    } else {
      return `Expire dans ${daysUntilExpiry} jours`;
    }
  } catch (error) {
    return 'Date invalide';
  }
};
