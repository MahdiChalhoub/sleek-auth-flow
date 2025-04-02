
/**
 * Utility functions for formatting data
 */

/**
 * Format a date string to a localized date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a number with commas as thousands separators
 */
export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '0';
  
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the number has 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Return the original if it doesn't match the expected format
  return phone;
};
