
/**
 * Format a date string to a localized date format
 */
export const formatDate = (dateString: string | undefined, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!dateString) return 'N/A';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(dateString).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format a currency value
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};
