
import { Transaction, LedgerEntry } from '../transaction';
import { TransactionPermission } from '../interfaces/permissionInterfaces';

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 125.50,
    type: 'income',
    status: 'open',
    createdAt: '2023-06-01T10:30:00Z',
    updatedAt: '2023-06-01T10:30:00Z',
    createdBy: 'John Admin',
    description: 'Grocery purchase',
    paymentMethod: 'cash',
    journalEntries: []
  },
  {
    id: 't2',
    amount: 75.25,
    type: 'expense',
    status: 'locked',
    createdAt: '2023-06-01T11:45:00Z',
    updatedAt: '2023-06-01T12:00:00Z',
    createdBy: 'Cathy Cashier',
    description: 'Electronics',
    paymentMethod: 'card',
    lockedBy: 'Cathy Cashier',
    lockedAt: '2023-06-01T12:00:00Z',
    journalEntries: []
  },
  {
    id: 't3',
    amount: 250.00,
    type: 'expense',
    status: 'verified',
    createdAt: '2023-06-01T13:15:00Z',
    updatedAt: '2023-06-01T14:30:00Z',
    createdBy: 'Mike Manager',
    description: 'Office supplies',
    paymentMethod: 'bank',
    lockedBy: 'Mike Manager',
    lockedAt: '2023-06-01T13:45:00Z',
    verifiedBy: 'John Admin',
    verifiedAt: '2023-06-01T14:30:00Z',
    journalEntries: []
  },
  {
    id: 't4',
    amount: 50.75,
    type: 'expense',
    status: 'secure',
    createdAt: '2023-06-01T15:00:00Z',
    updatedAt: '2023-06-01T16:20:00Z',
    createdBy: 'John Admin',
    description: 'Food & beverages',
    paymentMethod: 'wave',
    lockedBy: 'John Admin',
    lockedAt: '2023-06-01T15:30:00Z',
    verifiedBy: 'Sarah Supervisor',
    verifiedAt: '2023-06-01T16:00:00Z',
    journalEntries: []
  },
];

export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: "le1",
    account: "Cash",
    amount: 125.50,
    description: "Cash received for grocery purchase",
    createdAt: "2023-06-01T10:30:00Z",
    createdBy: "John Admin",
    reference: "INV-001",
    accountType: "cash",
    isDebit: true,
    date: "2023-06-01T10:30:00Z",
    debit: 125.50,
    credit: 0,
    balance: 125.50,
    transactionId: "t1"
  },
  {
    id: "le2",
    account: "Revenue",
    amount: 125.50,
    description: "Revenue from grocery purchase",
    createdAt: "2023-06-01T10:30:00Z",
    createdBy: "John Admin",
    reference: "INV-001",
    accountType: "revenue",
    isDebit: false,
    date: "2023-06-01T10:30:00Z",
    debit: 0,
    credit: 125.50,
    balance: 125.50,
    transactionId: "t1"
  },
  {
    id: "le3",
    account: "Bank",
    amount: 75.25,
    description: "Card payment for electronics",
    createdAt: "2023-06-01T11:45:00Z",
    createdBy: "Cathy Cashier",
    reference: "EXP-001",
    accountType: "bank",
    isDebit: true,
    date: "2023-06-01T11:45:00Z",
    debit: 75.25,
    credit: 0,
    balance: 75.25,
    transactionId: "t2"
  },
  {
    id: "le4",
    account: "Revenue",
    amount: 75.25,
    description: "Revenue from electronics sale",
    createdAt: "2023-06-01T11:45:00Z",
    createdBy: "Cathy Cashier",
    reference: "EXP-001",
    accountType: "revenue",
    isDebit: false,
    date: "2023-06-01T11:45:00Z",
    debit: 0,
    credit: 75.25,
    balance: 75.25,
    transactionId: "t2"
  }
];

// Journal entries data model updated for compatibility
export interface JournalTransaction {
  id: string;
  date: string;
  transactionType: string;
  description: string;
  entries: LedgerEntry[];
  createdBy: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export const mockJournalTransactions: JournalTransaction[] = [
  {
    id: "j1",
    date: "2023-06-01T10:30:00Z",
    transactionType: "sale",
    description: "Sale of grocery items",
    entries: [
      {
        id: "le1",
        account: "Cash",
        amount: 125.50,
        description: "Cash received for grocery purchase",
        createdAt: "2023-06-01T10:30:00Z",
        createdBy: "John Admin",
        accountType: "cash",
        isDebit: true,
        date: "2023-06-01T10:30:00Z",
        debit: 125.50,
        credit: 0,
        balance: 125.50,
        reference: "INV-001",
        transactionId: "t1"
      },
      {
        id: "le2",
        account: "Revenue",
        amount: 125.50,
        description: "Revenue from grocery purchase",
        createdAt: "2023-06-01T10:30:00Z",
        createdBy: "John Admin",
        accountType: "revenue",
        isDebit: false,
        date: "2023-06-01T10:30:00Z",
        debit: 0,
        credit: 125.50,
        balance: 125.50,
        reference: "INV-001",
        transactionId: "t1"
      }
    ],
    createdBy: "John Admin",
    verified: true,
    verifiedBy: "Sarah Supervisor",
    verifiedAt: "2023-06-01T11:00:00Z",
  },
  {
    id: "j2",
    date: "2023-06-01T11:45:00Z",
    transactionType: "sale",
    description: "Sale of electronics",
    entries: [
      {
        id: "le3",
        account: "Bank",
        amount: 75.25,
        description: "Card payment for electronics",
        createdAt: "2023-06-01T11:45:00Z",
        createdBy: "Cathy Cashier",
        accountType: "bank",
        isDebit: true,
        date: "2023-06-01T11:45:00Z",
        debit: 75.25,
        credit: 0,
        balance: 75.25,
        reference: "EXP-001",
        transactionId: "t2"
      },
      {
        id: "le4",
        account: "Revenue",
        amount: 75.25,
        description: "Revenue from electronics sale",
        createdAt: "2023-06-01T11:45:00Z",
        createdBy: "Cathy Cashier",
        accountType: "revenue",
        isDebit: false,
        date: "2023-06-01T11:45:00Z",
        debit: 0,
        credit: 75.25,
        balance: 75.25,
        reference: "EXP-001",
        transactionId: "t2"
      }
    ],
    createdBy: "Cathy Cashier",
    verified: true,
    verifiedBy: "John Admin",
    verifiedAt: "2023-06-01T12:15:00Z",
  },
  {
    id: "j3",
    date: "2023-06-01T13:00:00Z",
    transactionType: "purchase",
    description: "Purchase of office supplies",
    entries: [
      {
        id: "le5",
        account: "Inventory",
        amount: 250.00,
        description: "Purchase of office supplies inventory",
        createdAt: "2023-06-01T13:00:00Z",
        createdBy: "Mike Manager",
        accountType: "inventory",
        isDebit: true,
        date: "2023-06-01T13:00:00Z",
        debit: 250.00,
        credit: 0,
        balance: 250.00,
        reference: "PUR-001",
        transactionId: "t3"
      },
      {
        id: "le6",
        account: "Accounts Payable",
        amount: 250.00,
        description: "Payable for office supplies purchase",
        createdAt: "2023-06-01T13:00:00Z",
        createdBy: "Mike Manager",
        accountType: "accounts_payable",
        isDebit: false,
        date: "2023-06-01T13:00:00Z",
        debit: 0,
        credit: 250.00,
        balance: 250.00,
        reference: "PUR-001",
        transactionId: "t3"
      }
    ],
    createdBy: "Mike Manager",
    verified: false,
    notes: "Awaiting verification"
  }
];

export const mockTransactionPermissions: TransactionPermission[] = [
  {
    roleId: 'r1', // Admin
    canCreate: true,
    canEdit: true,
    canLock: true,
    canUnlock: true,
    canVerify: true,
    canUnverify: true,
    canDelete: true,
    canViewReports: true,
  },
  {
    roleId: 'r2', // Manager
    canCreate: true,
    canEdit: true,
    canLock: true,
    canUnlock: true,
    canVerify: true,
    canUnverify: false,
    canDelete: false,
    canViewReports: true,
  },
  {
    roleId: 'r3', // Cashier
    canCreate: true,
    canEdit: false,
    canLock: true,
    canUnlock: false,
    canVerify: false,
    canUnverify: false,
    canDelete: false,
    canViewReports: false,
  },
];
