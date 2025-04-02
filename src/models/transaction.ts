
// Re-export types from the appropriate locations
export type { 
  PaymentMethod,
  TransactionStatus,
  DiscrepancyResolution,
  AccountType,
  TransactionType
} from './types/transactionTypes';

export type {
  Transaction,
  JournalEntry,
  LedgerEntry,
  TransactionSummary,
  TransactionItem,
  Business
} from './interfaces/transactionInterfaces';

// Re-export needed types from their proper locations
export type { 
  TransactionPermission,
  StaffFinancePermission,
  LoyaltyPermission,
  ReturnPermission
} from './interfaces/permissionInterfaces';

// Re-export Register types from registerInterfaces
export type {
  Register,
  RegisterSession
} from './interfaces/registerInterfaces';

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
