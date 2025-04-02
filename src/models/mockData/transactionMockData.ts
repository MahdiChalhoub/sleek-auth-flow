
import { Transaction, TransactionStatus, TransactionType, JournalEntry, LedgerEntry } from '@/models/transaction';

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: 'tr1',
    amount: 100,
    status: 'open' as TransactionStatus,
    type: 'sale' as TransactionType,
    description: 'Sale of products',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    createdBy: 'user1',
    paymentMethod: 'cash',
    branchId: 'branch-1',
    journalEntries: [] as JournalEntry[]
  },
  {
    id: 'tr2',
    amount: 50,
    status: 'locked' as TransactionStatus,
    type: 'expense' as TransactionType,
    description: 'Office supplies',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    createdBy: 'user2',
    paymentMethod: 'card',
    branchId: 'branch-1',
    journalEntries: [] as JournalEntry[]
  },
  {
    id: 'tr3',
    amount: 200,
    status: 'verified' as TransactionStatus,
    type: 'income' as TransactionType,
    description: 'Consulting services',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    createdBy: 'user1',
    paymentMethod: 'bank',
    branchId: 'branch-2',
    journalEntries: [] as JournalEntry[]
  },
  {
    id: 'tr4',
    amount: 150,
    status: 'secure' as TransactionStatus,
    type: 'transfer' as TransactionType,
    description: 'Transfer between accounts',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdBy: 'user3',
    paymentMethod: 'bank',
    branchId: 'branch-3',
    journalEntries: [] as JournalEntry[]
  }
];

// Mock ledger entries
export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: "le1",
    transactionId: "tx1",
    accountType: "Cash",
    amount: 100,
    isDebit: true,
    description: "Cash payment",
    createdAt: new Date().toISOString(),
    createdBy: "System",
    date: new Date().toISOString()
  },
  {
    id: "le2",
    transactionId: "tx1",
    accountType: "Sales Revenue",
    amount: 100,
    isDebit: false,
    description: "Sales revenue",
    createdAt: new Date().toISOString(),
    createdBy: "System",
    date: new Date().toISOString()
  },
  {
    id: "le3",
    transactionId: "tx2",
    accountType: "Cash",
    amount: 200,
    isDebit: false,
    description: "Purchase payment",
    createdAt: new Date().toISOString(),
    createdBy: "System",
    date: new Date().toISOString()
  },
  {
    id: "le4",
    transactionId: "tx2",
    accountType: "Expenses",
    amount: 200,
    isDebit: true,
    description: "Office supplies",
    createdAt: new Date().toISOString(),
    createdBy: "System",
    date: new Date().toISOString()
  }
];

// Mock transaction permissions for the TransactionPermissions page
export const mockTransactionPermissions = [
  {
    id: "can_view_transactions",
    name: "View Transactions",
    description: "Can view transaction details and history",
    defaultRoles: ["admin", "manager", "accountant", "cashier"]
  },
  {
    id: "can_create_transactions",
    name: "Create Transactions",
    description: "Can create new transactions",
    defaultRoles: ["admin", "manager", "accountant", "cashier"]
  },
  {
    id: "can_edit_transactions",
    name: "Edit Transactions",
    description: "Can edit existing open transactions",
    defaultRoles: ["admin", "manager", "accountant"]
  },
  {
    id: "can_delete_transactions",
    name: "Delete Transactions",
    description: "Can delete transactions (except secure ones)",
    defaultRoles: ["admin"]
  },
  {
    id: "can_lock_transactions",
    name: "Lock Transactions",
    description: "Can lock transactions to prevent edits",
    defaultRoles: ["admin", "manager", "accountant"]
  },
  {
    id: "can_unlock_transactions",
    name: "Unlock Transactions",
    description: "Can unlock previously locked transactions",
    defaultRoles: ["admin", "manager"]
  },
  {
    id: "can_verify_transactions",
    name: "Verify Transactions",
    description: "Can mark transactions as verified",
    defaultRoles: ["admin", "manager"]
  },
  {
    id: "can_unverify_transactions",
    name: "Unverify Transactions",
    description: "Can mark verified transactions as unverified",
    defaultRoles: ["admin"]
  },
  {
    id: "can_secure_transactions",
    name: "Secure Transactions",
    description: "Can mark transactions as secure (permanent)",
    defaultRoles: ["admin"]
  },
  {
    id: "can_export_transactions",
    name: "Export Transactions",
    description: "Can export transaction data",
    defaultRoles: ["admin", "manager", "accountant"]
  },
  {
    id: "can_generate_reports",
    name: "Generate Reports",
    description: "Can generate transaction reports",
    defaultRoles: ["admin", "manager", "accountant"]
  }
];
