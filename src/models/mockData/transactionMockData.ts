
import { Transaction, TransactionStatus, PaymentMethod, TransactionType, LedgerEntry } from '../transaction';
import { mockLedgerEntries } from './ledgerEntryData';

// Use the mockLedgerEntries instead of recreating ledger entries here
export const transactionsMock: Transaction[] = [
  {
    id: 'tx1',
    amount: 1250.75,
    status: 'open' as TransactionStatus,
    type: 'sale' as TransactionType,
    description: 'Monthly sales revenue',
    createdAt: '2023-01-15T09:30:00.000Z',
    updatedAt: '2023-01-15T09:30:00.000Z',
    createdBy: 'John Doe',
    paymentMethod: 'cash' as PaymentMethod,
    branchId: 'branch-1',
    notes: 'January sales',
    journalEntries: mockLedgerEntries.filter(entry => entry.transactionId === 'tx1')
  },
  {
    id: 'tx2',
    amount: 450.00,
    status: 'verified' as TransactionStatus,
    type: 'expense' as TransactionType,
    description: 'Office supplies',
    createdAt: '2023-01-17T14:20:00.000Z',
    updatedAt: '2023-01-17T14:20:00.000Z',
    createdBy: 'Jane Smith',
    paymentMethod: 'bank' as PaymentMethod,
    branchId: 'branch-2',
    notes: 'Monthly supplies for office',
    journalEntries: mockLedgerEntries.filter(entry => entry.transactionId === 'tx2')
  },
  {
    id: 'tx3',
    amount: 2000.00,
    status: 'locked' as TransactionStatus,
    type: 'transfer' as TransactionType,
    description: 'Transfer between branches',
    createdAt: '2023-01-20T11:15:00.000Z',
    updatedAt: '2023-01-20T11:15:00.000Z',
    createdBy: 'Admin User',
    paymentMethod: 'bank' as PaymentMethod,
    branchId: 'branch-1',
    notes: 'Fund allocation',
    journalEntries: []
  },
  {
    id: 'tx4',
    amount: 3500.00,
    status: 'open' as TransactionStatus,
    type: 'income' as TransactionType,
    description: 'Consulting services',
    createdAt: '2023-01-25T09:45:00.000Z',
    updatedAt: '2023-01-25T09:45:00.000Z',
    createdBy: 'John Doe',
    paymentMethod: 'card' as PaymentMethod,
    branchId: 'branch-3',
    notes: 'Project completion payment',
    journalEntries: []
  },
  {
    id: 'tx5',
    amount: 750.25,
    status: 'verified' as TransactionStatus,
    type: 'expense' as TransactionType,
    description: 'Equipment maintenance',
    createdAt: '2023-01-28T13:50:00.000Z',
    updatedAt: '2023-01-28T13:50:00.000Z',
    createdBy: 'Jane Smith',
    paymentMethod: 'cash' as PaymentMethod,
    branchId: 'branch-2',
    notes: 'Repair of office printer',
    journalEntries: []
  }
];

export const getTransactionById = (id: string): Transaction | undefined => {
  return transactionsMock.find(transaction => transaction.id === id);
};

export const getTransactionsByBranch = (branchId: string): Transaction[] => {
  return transactionsMock.filter(transaction => transaction.branchId === branchId);
};

export const getTransactionsByType = (type: TransactionType): Transaction[] => {
  return transactionsMock.filter(transaction => transaction.type === type);
};

export const getTransactionsByStatus = (status: TransactionStatus): Transaction[] => {
  return transactionsMock.filter(transaction => transaction.status === status);
};

export const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return transactionsMock.filter(transaction => {
    const txDate = new Date(transaction.createdAt).getTime();
    return txDate >= start && txDate <= end;
  });
};
