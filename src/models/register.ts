
import { PaymentMethod, DiscrepancyResolution } from './transaction';

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

// Mock registers data for development
export const mockRegisters: Register[] = [
  {
    id: "reg1",
    name: "Main Register",
    isOpen: true,
    openedAt: "2023-07-01T09:00:00Z",
    openedBy: "John Doe",
    openingBalance: {
      cash: 100,
      card: 0,
      bank: 0,
      mobile: 0,
      wave: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 350.75,
      card: 425.50,
      bank: 150,
      mobile: 75,
      wave: 0,
      not_specified: 0
    },
    expectedBalance: {
      cash: 350.75,
      card: 425.50,
      bank: 150,
      mobile: 75,
      wave: 0,
      not_specified: 0
    }
  },
  {
    id: "reg2",
    name: "Secondary Register",
    isOpen: false,
    openedAt: "2023-07-01T08:30:00Z",
    openedBy: "Jane Smith",
    closedAt: "2023-07-01T17:00:00Z",
    closedBy: "Jane Smith",
    openingBalance: {
      cash: 200,
      card: 0,
      bank: 0,
      mobile: 0,
      wave: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 450.25,
      card: 375,
      bank: 0,
      mobile: 125.50,
      wave: 0,
      not_specified: 0
    },
    expectedBalance: {
      cash: 500,
      card: 375,
      bank: 0,
      mobile: 125.50,
      wave: 0,
      not_specified: 0
    },
    discrepancies: {
      cash: -49.75,
      card: 0,
      bank: 0,
      mobile: 0,
      wave: 0,
      not_specified: 0
    },
    discrepancyResolution: "approved",
    discrepancyApprovedBy: "Manager",
    discrepancyApprovedAt: "2023-07-01T17:15:00Z",
    discrepancyNotes: "Small cash discrepancy due to incorrect change given."
  }
];
