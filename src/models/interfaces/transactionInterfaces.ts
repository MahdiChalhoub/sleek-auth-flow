
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
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  amount: number;
  type: 'debit' | 'credit';
  account: AccountType;
  description?: string;
  createdAt: string;
  updatedAt: string;
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
  accountId: string;
  accountName: string;
  type: TransactionType;
}

export interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}
