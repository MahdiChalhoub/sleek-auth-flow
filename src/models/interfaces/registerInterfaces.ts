
import { PaymentMethod } from '../types/transactionTypes';

// Define DiscrepancyResolution type to match what's used in transactionTypes
export type DiscrepancyResolution = 'pending' | 'approved' | 'rejected' | 'deduct_salary' | 'ecart_caisse' | 'adjusted';

export interface Register {
  id: string;
  name: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  closedBy?: string;
  openingBalance: Record<PaymentMethod, number>;
  currentBalance: Record<PaymentMethod, number>;
  expectedBalance: Record<PaymentMethod, number>;
  discrepancies?: Record<PaymentMethod, number>;
  discrepancyResolution?: DiscrepancyResolution;
  discrepancyApprovedBy?: string;
  discrepancyApprovedAt?: string;
  discrepancyNotes?: string;
}

export interface RegisterSession {
  id: string;
  registerId: string;
  cashierId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingBalance: Record<PaymentMethod, number>;
  closingBalance?: Record<PaymentMethod, number>;
  expectedBalance?: Record<PaymentMethod, number>;
  discrepancies?: Record<PaymentMethod, number>;
  discrepancyResolution?: DiscrepancyResolution;
  discrepancyApprovedBy?: string;
  discrepancyApprovedAt?: string;
  discrepancyNotes?: string;
}
