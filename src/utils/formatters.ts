
import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to a human-readable format
 * @param dateString - The date string to format
 * @param formatString - The format string to use (default: 'PPP')
 * @returns Formatted date string or 'N/A' if invalid
 */
export function formatDate(dateString?: string, formatString: string = 'PPP'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

/**
 * Format a currency value
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount?: number, currency: string = 'USD'): string {
  if (amount === undefined || amount === null) return '-';
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
}

/**
 * Format a number with thousands separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export function formatNumber(value?: number, decimals: number = 0): string {
  if (value === undefined || value === null) return '-';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}
