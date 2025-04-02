
import { TransactionStatus, TransactionType, PaymentMethod, AccountType } from '../types/transactionTypes';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType; 
  date?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  status: TransactionStatus;
  notes?: string;
  branchId?: string;
  locationId?: string;
  clientId?: string;
  financialYearId?: string;
  journalEntries?: JournalEntry[];
  referenceId?: string;
  referenceType?: string;
  paymentMethod: PaymentMethod;
  verifiedBy?: string;
  verifiedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  amount: number;
  type: 'debit' | 'credit';
  account: AccountType | string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  reference?: string;
  isDebit?: boolean;
  accountType?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  pendingCount: number;
  recentTransactions: Transaction[];
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  notes?: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
  account: string;
  accountName: string;
  type: TransactionType;
  amount?: number; // Added to match usage in mockData
  accountId?: string; // Added to match usage in components
}

export interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  address?: string;
  logo?: string;
  status?: string;
}
