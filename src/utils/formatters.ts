
/**
 * Formats a date string to a localized format (e.g., "Jan 1, 2023")
 */
export function getFormattedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'Invalid date';
  }
}

/**
 * Formats a date string to a localized date and time format (e.g., "Jan 1, 2023, 12:00 PM")
 */
export function getFormattedDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString || 'Invalid date';
  }
}

/**
 * Formats a number as currency (e.g., "$123.45")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount.toFixed(2)}`;
  }
}

/**
 * Formats a number with thousand separators (e.g., "1,234.56")
 */
export function formatNumber(value: number): string {
  try {
    return new Intl.NumberFormat('en-US').format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
}

/**
 * Formats a phone number (e.g., "(123) 456-7890")
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // If not standard format, return as is with spaces every 3 digits
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
