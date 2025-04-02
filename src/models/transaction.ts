
// Create or update the transaction.ts file to export PaymentMethod
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'wave' | 'mobile' | 'not_specified';

export type TransactionStatus = 'open' | 'locked' | 'verified' | 'secure' | 'pending' | 'unverified';

export type TransactionType = 'sale' | 'expense' | 'transfer' | 'adjustment' | 'income' | 'purchase' | 'return_sale' | 'return_purchase' | 'payment_received' | 'payment_made' | 'salary' | 'cash_in' | 'cash_out';

export type DiscrepancyResolution = 'pending' | 'deduct_salary' | 'ecart_caisse' | 'approved' | 'rejected' | 'adjusted';

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  paymentMethod: PaymentMethod;
  branchId?: string;
  notes?: string;
  referenceId?: string;
  referenceType?: string;
  financialYearId?: string;
  journalEntries: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  account: string;
  amount: number;
  type: 'debit' | 'credit';
  description?: string;
  createdAt: string;
  updatedAt: string;
  reference?: string;
  accountType?: string;
  isDebit?: boolean;
}

// Add this interface to support the LedgerEntry type used in some components
export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountType: string;
  amount: number;
  isDebit: boolean;
  description: string;
  reference?: string;
  createdAt: string;
  createdBy: string;
  date?: string;
}

// Define the DB types for mapping
export interface DBTransaction {
  id: string;
  amount: number;
  status: string;
  type: string;
  notes: string | null;
  location_id: string | null;
  reference_id: string | null;
  reference_type: string | null;
  financial_year_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBJournalEntry {
  id: string;
  transaction_id: string;
  accountType: string;
  amount: number;
  isDebit: boolean;
  description: string;
  reference?: string;
  created_at: string;
  updated_at: string;
  createdBy: string;
}

// Adding Business interface that was missing
export interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  address?: string;
  logo?: string;
  status?: string;
}
