
// Let's fix the interface issue with LedgerEntry and JournalEntry
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'mobile' | 'wave' | 'not_specified';
export type TransactionStatus = 'pending' | 'open' | 'verified' | 'secure' | 'locked' | 'unverified';
export type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';

// Properties needed for both LedgerEntry and JournalEntry
interface BaseJournalEntry {
  id: string;
  transactionId: string;
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
  accountType?: string; // Added for compatibility
  isDebit?: boolean;    // Added for compatibility
}

// Update JournalEntry with needed fields
export interface JournalEntry extends BaseJournalEntry {
  account: string;
  type: 'debit' | 'credit';
  updatedAt: string;
  accountType?: string; // Added for compatibility
  isDebit?: boolean;    // Added for compatibility
  reference?: string;   // Added for compatibility
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
}

// Mock data for development
export const mockTransactions: Transaction[] = [
  {
    id: 'tr1',
    type: 'income',
    amount: 1500,
    status: 'verified',
    description: 'Sales revenue',
    paymentMethod: 'cash',
    createdAt: '2023-05-15T08:30:00Z',
    updatedAt: '2023-05-15T08:35:00Z',
    createdBy: 'John Doe',
    branchId: 'branch-1',
    date: '2023-05-15T08:30:00Z',
    verifiedBy: 'Jane Smith',
    verifiedAt: '2023-05-15T09:30:00Z',
    journalEntries: []
  },
  {
    id: 'tr2',
    type: 'expense',
    amount: 350,
    status: 'locked',
    description: 'Office supplies',
    paymentMethod: 'card',
    createdAt: '2023-05-16T10:15:00Z',
    updatedAt: '2023-05-16T10:20:00Z',
    createdBy: 'Jane Smith',
    branchId: 'branch-1',
    date: '2023-05-16T10:15:00Z',
    lockedBy: 'System',
    journalEntries: []
  },
  {
    id: 'tr3',
    type: 'expense',
    amount: 2250,
    status: 'pending',
    description: 'Rent payment',
    paymentMethod: 'bank',
    createdAt: '2023-05-17T14:45:00Z',
    updatedAt: '2023-05-17T14:50:00Z',
    createdBy: 'John Doe',
    branchId: 'branch-2',
    date: '2023-05-17T14:45:00Z',
    journalEntries: []
  }
];

// Mock data for ledger entries
export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: 'le1',
    transactionId: 'tr1',
    date: '2023-05-15T08:30:00Z',
    account: 'Cash',
    accountType: 'Asset',
    description: 'Sales revenue',
    debit: 1500,
    credit: 0,
    balance: 1500,
    reference: 'INV-001',
    createdAt: '2023-05-15T08:30:00Z',
    createdBy: 'System',
    isDebit: true
  },
  {
    id: 'le2',
    transactionId: 'tr1',
    date: '2023-05-15T08:30:00Z',
    account: 'Sales Revenue',
    accountType: 'Income',
    description: 'Sales revenue',
    debit: 0,
    credit: 1500,
    balance: 1500,
    reference: 'INV-001',
    createdAt: '2023-05-15T08:30:00Z',
    createdBy: 'System',
    isDebit: false
  },
  {
    id: 'le3',
    transactionId: 'tr2',
    date: '2023-05-16T10:15:00Z',
    account: 'Office Supplies Expense',
    accountType: 'Expense',
    description: 'Office supplies',
    debit: 350,
    credit: 0,
    balance: 350,
    reference: 'EXP-001',
    createdAt: '2023-05-16T10:15:00Z',
    createdBy: 'System',
    isDebit: true
  },
  {
    id: 'le4',
    transactionId: 'tr2',
    date: '2023-05-16T10:15:00Z',
    account: 'Bank',
    accountType: 'Asset',
    description: 'Office supplies',
    debit: 0,
    credit: 350,
    balance: 350,
    reference: 'EXP-001',
    createdAt: '2023-05-16T10:15:00Z',
    createdBy: 'System',
    isDebit: false
  }
];

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
