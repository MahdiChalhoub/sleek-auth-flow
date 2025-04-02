
// Let's fix the interface issue with LedgerEntry and JournalEntry
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'mobile' | 'wave' | 'not_specified';
export type TransactionStatus = 'pending' | 'open' | 'verified' | 'secure' | 'locked' | 'unverified';
export type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';

// Properties needed for both LedgerEntry and JournalEntry
interface BaseJournalEntry {
  id: string;
  transactionId?: string;
  amount: number;
  description: string;
  createdAt: string;
  createdBy: string;
}

// Update LedgerEntry with needed fields
export interface LedgerEntry extends BaseJournalEntry {
  date: string;
  debit: number;
  credit: number;
  balance: number;
  account: string;
  reference: string;
  accountType: string;
  isDebit: boolean;
}

// Update JournalEntry with needed fields
export interface JournalEntry extends BaseJournalEntry {
  account: string;
  type: 'debit' | 'credit';
  updatedAt: string;
  accountType?: string;
  isDebit?: boolean;
  reference?: string;
}

// Update Transaction interface
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description: string;
  paymentMethod: PaymentMethod;
  branchId?: string;
  notes?: string;
  referenceId?: string;
  referenceType?: string;
  financialYearId?: string;
  journalEntries: JournalEntry[];
  date?: string;
  // Additional fields for compatibility
  verifiedBy?: string;
  verifiedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
}

// Re-export needed types and mock data from their proper locations
export { 
  TransactionPermission,
  StaffFinancePermission,
  LoyaltyPermission,
  ReturnPermission
} from './interfaces/permissionInterfaces';

export { 
  mockTransactions,
  mockLedgerEntries,
  mockJournalTransactions,
  mockTransactionPermissions
} from './mockData/transactionMockData';

// Mock data for branches
export const mockBranches = [
  {
    id: 'branch-1',
    name: 'Main Store',
    address: '123 Main St',
    businessId: 'business-1',
    type: 'store',
    status: 'active',
    isDefault: true
  },
  {
    id: 'branch-2',
    name: 'Warehouse',
    address: '456 Storage Blvd',
    businessId: 'business-1',
    type: 'warehouse',
    status: 'active',
    isDefault: false
  },
  {
    id: 'branch-3',
    name: 'Downtown Location',
    address: '789 Center Ave',
    businessId: 'business-1',
    type: 'store',
    status: 'maintenance',
    isDefault: false
  }
] as const;

// Branch type definition 
export type Branch = typeof mockBranches[number];
