
import { differenceInDays, parseISO, format, addDays } from 'date-fns';

/**
 * Determine the status of a batch based on its expiry date
 * @param expiryDate The expiry date string in ISO format
 */
export const getBatchStatus = (expiryDate: string): 'expired' | 'warning' | 'ok' | 'unknown' => {
  if (!expiryDate) return 'unknown';
  
  try {
    const today = new Date();
    const expiry = parseISO(expiryDate);
    const daysRemaining = differenceInDays(expiry, today);
    
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining < 30) return 'warning';
    return 'ok';
  } catch (error) {
    console.error('Error parsing expiry date:', error);
    return 'unknown';
  }
};

/**
 * Format the days until expiry as a human-readable string
 * @param expiryDate The expiry date string in ISO format
 */
export const formatDaysUntilExpiry = (expiryDate: string): string => {
  if (!expiryDate) return 'No expiry date';
  
  try {
    const today = new Date();
    const expiry = parseISO(expiryDate);
    const daysRemaining = differenceInDays(expiry, today);
    
    if (daysRemaining < 0) {
      return `Expired ${Math.abs(daysRemaining)} days ago`;
    } else if (daysRemaining === 0) {
      return 'Expires today';
    } else if (daysRemaining === 1) {
      return 'Expires tomorrow';
    } else if (daysRemaining < 30) {
      return `Expires in ${daysRemaining} days`;
    } else {
      return `Expires on ${format(expiry, 'MMM d, yyyy')}`;
    }
  } catch (error) {
    console.error('Error formatting days until expiry:', error);
    return 'Invalid date';
  }
};

/**
 * Calculate an appropriate expiry date based on product type
 * @param productType The type of product (e.g., 'dairy', 'frozen', 'dry')
 */
export const calculateDefaultExpiryDate = (productType: string): Date => {
  const today = new Date();
  
  switch (productType.toLowerCase()) {
    case 'dairy':
      return addDays(today, 14); // 2 weeks
    case 'frozen':
      return addDays(today, 180); // 6 months
    case 'produce':
      return addDays(today, 7); // 1 week
    case 'meat':
      return addDays(today, 5); // 5 days
    case 'bakery':
      return addDays(today, 3); // 3 days
    case 'canned':
      return addDays(today, 730); // 2 years
    default:
      return addDays(today, 365); // 1 year default
  }
};
