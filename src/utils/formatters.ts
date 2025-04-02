
/**
 * Formats a date string into a readable format
 */
export const getFormattedDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Format the date: MM/DD/YYYY HH:MM
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a percentage
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'percent', 
    minimumFractionDigits: 1,
    maximumFractionDigits: 1 
  }).format(value / 100);
};

/**
 * Formats a number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
