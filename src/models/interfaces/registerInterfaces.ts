
import { DiscrepancyResolution, PaymentMethod } from '../types/transactionTypes';

export interface Register {
  id: string;
  name: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  closedBy?: string;
  openingBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  currentBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  expectedBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  discrepancies?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
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
  openingBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  closingBalance?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  expectedBalance?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  discrepancies?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  discrepancyResolution?: DiscrepancyResolution;
  discrepancyApprovedBy?: string;
  discrepancyApprovedAt?: string;
  discrepancyNotes?: string;
}
