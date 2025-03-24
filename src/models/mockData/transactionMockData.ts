
import { Transaction, LedgerEntry, JournalTransaction } from '../interfaces/transactionInterfaces';
import { TransactionPermission } from '../interfaces/permissionInterfaces';

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 125.50,
    status: 'open',
    createdAt: '2023-06-01T10:30:00Z',
    updatedAt: '2023-06-01T10:30:00Z',
    createdBy: 'John Admin',
    description: 'Grocery purchase',
    paymentMethod: 'cash',
  },
  {
    id: 't2',
    amount: 75.25,
    status: 'locked',
    createdAt: '2023-06-01T11:45:00Z',
    updatedAt: '2023-06-01T12:00:00Z',
    createdBy: 'Cathy Cashier',
    description: 'Electronics',
    paymentMethod: 'card',
    lockedBy: 'Cathy Cashier',
    lockedAt: '2023-06-01T12:00:00Z',
  },
  {
    id: 't3',
    amount: 250.00,
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
  },
  {
    id: 't4',
    amount: 50.75,
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
  },
];

export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: "le1",
    transactionId: "t1",
    accountType: "cash",
    amount: 125.50,
    isDebit: true,
    description: "Cash received for grocery purchase",
    createdAt: "2023-06-01T10:30:00Z",
    createdBy: "John Admin",
  },
  {
    id: "le2",
    transactionId: "t1",
    accountType: "revenue",
    amount: 125.50,
    isDebit: false,
    description: "Revenue from grocery purchase",
    createdAt: "2023-06-01T10:30:00Z",
    createdBy: "John Admin",
  },
  {
    id: "le3",
    transactionId: "t2",
    accountType: "bank",
    amount: 75.25,
    isDebit: true,
    description: "Card payment for electronics",
    createdAt: "2023-06-01T11:45:00Z",
    createdBy: "Cathy Cashier",
  },
  {
    id: "le4",
    transactionId: "t2",
    accountType: "revenue",
    amount: 75.25,
    isDebit: false,
    description: "Revenue from electronics sale",
    createdAt: "2023-06-01T11:45:00Z",
    createdBy: "Cathy Cashier",
  }
];

export const mockJournalTransactions: JournalTransaction[] = [
  {
    id: "j1",
    date: "2023-06-01T10:30:00Z",
    transactionType: "sale",
    description: "Sale of grocery items",
    entries: [
      {
        id: "le1",
        transactionId: "t1",
        accountType: "cash",
        amount: 125.50,
        isDebit: true,
        description: "Cash received for grocery purchase",
        createdAt: "2023-06-01T10:30:00Z",
        createdBy: "John Admin",
      },
      {
        id: "le2",
        transactionId: "t1",
        accountType: "revenue",
        amount: 125.50,
        isDebit: false,
        description: "Revenue from grocery purchase",
        createdAt: "2023-06-01T10:30:00Z",
        createdBy: "John Admin",
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
        transactionId: "t2",
        accountType: "bank",
        amount: 75.25,
        isDebit: true,
        description: "Card payment for electronics",
        createdAt: "2023-06-01T11:45:00Z",
        createdBy: "Cathy Cashier",
      },
      {
        id: "le4",
        transactionId: "t2",
        accountType: "revenue",
        amount: 75.25,
        isDebit: false,
        description: "Revenue from electronics sale",
        createdAt: "2023-06-01T11:45:00Z",
        createdBy: "Cathy Cashier",
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
        transactionId: "t3",
        accountType: "inventory",
        amount: 250.00,
        isDebit: true,
        description: "Purchase of office supplies inventory",
        createdAt: "2023-06-01T13:00:00Z",
        createdBy: "Mike Manager",
      },
      {
        id: "le6",
        transactionId: "t3",
        accountType: "accounts_payable",
        amount: 250.00,
        isDebit: false,
        description: "Payable for office supplies purchase",
        createdAt: "2023-06-01T13:00:00Z",
        createdBy: "Mike Manager",
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
