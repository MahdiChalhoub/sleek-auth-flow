
import { addDays, isBefore, isAfter } from 'date-fns';

export type BatchStatus = 'fresh' | 'expiring_soon' | 'expired' | 'unknown';

export const getBatchStatus = (expiryDate: string | null): BatchStatus => {
  if (!expiryDate) return 'unknown';
  
  try {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = addDays(today, 30);
    
    if (isBefore(expiry, today)) {
      return 'expired';
    } else if (isBefore(expiry, thirtyDaysFromNow)) {
      return 'expiring_soon';
    } else {
      return 'fresh';
    }
  } catch (error) {
    console.error("Error parsing expiry date:", error);
    return 'unknown';
  }
};

export const getBatchStatusColor = (status: BatchStatus): string => {
  switch (status) {
    case 'fresh':
      return 'text-green-500 border-green-500';
    case 'expiring_soon':
      return 'text-amber-500 border-amber-500';
    case 'expired':
      return 'text-destructive border-destructive';
    default:
      return 'text-muted-foreground border-muted-foreground';
  }
};

export const getExpirySortValue = (expiryDate: string | null): number => {
  if (!expiryDate) return Infinity;
  
  try {
    const expiry = new Date(expiryDate);
    return expiry.getTime();
  } catch (error) {
    return Infinity;
  }
};

export const getExpiryLevel = (
  expiryDate: string | null
): 'critical' | 'warning' | 'normal' | 'unknown' => {
  if (!expiryDate) return 'unknown';
  
  try {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const sevenDaysFromNow = addDays(today, 7);
    const thirtyDaysFromNow = addDays(today, 30);
    
    if (isBefore(expiry, today)) {
      return 'critical';
    } else if (isBefore(expiry, sevenDaysFromNow)) {
      return 'critical';
    } else if (isBefore(expiry, thirtyDaysFromNow)) {
      return 'warning';
    } else {
      return 'normal';
    }
  } catch (error) {
    return 'unknown';
  }
};
