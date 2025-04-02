
// Date formatting
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'Invalid date';
  }
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount.toFixed(2)}`;
  }
};

// Percentage formatting
export const formatPercentage = (value: number): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value.toFixed(2)}%`;
  }
};

// Format number with commas
export const formatNumber = (num: number): string => {
  try {
    return new Intl.NumberFormat('en-US').format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format according to length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // If not 10 digits, return the original
  return phone;
};

// Format address
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state && address.zipCode ? `${address.state} ${address.zipCode}` : address.state || address.zipCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};
