
import { PaymentMethod } from "../transaction";

// Re-export PaymentMethod for use in register-related files
export type { PaymentMethod } from "../transaction";

export type DiscrepancyResolution = 'pending' | 'deduct_salary' | 'ecart_caisse' | 'approved' | 'rejected' | 'adjusted';

export interface Register {
  id: string;
  name: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  closedBy?: string;
  discrepancyApprovedAt?: string;
  discrepancyApprovedBy?: string;
  discrepancyResolution?: DiscrepancyResolution;
  discrepancyNotes?: string;
  discrepancies?: Record<PaymentMethod, number>;
  openingBalance: Record<PaymentMethod, number>;
  currentBalance: Record<PaymentMethod, number>;
  expectedBalance: Record<PaymentMethod, number>;
}

export interface RegisterSession extends Register {
  // Add any additional properties specific to RegisterSession
}

export interface RegisterOptions {
  id?: string;
  businessId?: string;
}
