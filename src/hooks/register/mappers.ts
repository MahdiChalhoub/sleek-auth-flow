
import { Register, PaymentMethod, DiscrepancyResolution } from '@/models/transaction';

export interface DatabaseRegister {
  id: string;
  name: string;
  is_open: boolean;
  opened_at: string | null;
  closed_at: string | null;
  opened_by: string | null;
  closed_by: string | null;
  opening_balance: Record<PaymentMethod, number>;
  current_balance: Record<PaymentMethod, number>;
  expected_balance: Record<PaymentMethod, number>;
  discrepancies: Record<PaymentMethod, number> | null;
  discrepancy_resolution: DiscrepancyResolution | null;
  discrepancy_approved_by: string | null;
  discrepancy_approved_at: string | null;
  discrepancy_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const mapToAppModel = (dbRegister: DatabaseRegister): Register => {
  return {
    id: dbRegister.id,
    name: dbRegister.name,
    isOpen: dbRegister.is_open,
    openedAt: dbRegister.opened_at || undefined,
    closedAt: dbRegister.closed_at || undefined,
    openedBy: dbRegister.opened_by || undefined,
    closedBy: dbRegister.closed_by || undefined,
    openingBalance: dbRegister.opening_balance,
    currentBalance: dbRegister.current_balance,
    expectedBalance: dbRegister.expected_balance,
    discrepancies: dbRegister.discrepancies || undefined,
    discrepancyResolution: dbRegister.discrepancy_resolution || undefined,
    discrepancyApprovedBy: dbRegister.discrepancy_approved_by || undefined,
    discrepancyApprovedAt: dbRegister.discrepancy_approved_at || undefined,
    discrepancyNotes: dbRegister.discrepancy_notes || undefined
  };
};

export const mapToDbModel = (register: Register): Partial<DatabaseRegister> => {
  return {
    name: register.name,
    is_open: register.isOpen,
    opened_at: register.openedAt,
    closed_at: register.closedAt,
    opened_by: register.openedBy,
    closed_by: register.closedBy,
    opening_balance: register.openingBalance,
    current_balance: register.currentBalance,
    expected_balance: register.expectedBalance,
    discrepancies: register.discrepancies || null,
    discrepancy_resolution: register.discrepancyResolution,
    discrepancy_approved_by: register.discrepancyApprovedBy,
    discrepancy_approved_at: register.discrepancyApprovedAt,
    discrepancy_notes: register.discrepancyNotes
  };
};
