
import { TransactionStatus, PaymentMethod, AccountType, TransactionType, DiscrepancyResolution } from '../types/transactionTypes';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountType: AccountType;
  amount: number;
  isDebit: boolean;
  description: string;
  createdAt: string;
  createdBy: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface JournalTransaction {
  id: string;
  date: string;
  transactionType: TransactionType;
  description: string;
  entries: LedgerEntry[];
  createdBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  reference?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description: string;
  paymentMethod: PaymentMethod;
  items?: TransactionItem[];
  verifiedBy?: string;
  verifiedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
  journalEntries?: LedgerEntry[];
  branchId?: string;
  clientId?: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
}

export interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
