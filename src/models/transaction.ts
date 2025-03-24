
export type TransactionStatus = 'open' | 'locked' | 'verified' | 'secure';
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'wave' | 'mobile';

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description: string;
  paymentMethod: PaymentMethod;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Register {
  id: string;
  name: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  closedBy?: string;
  openingBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  currentBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  expectedBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
}

export interface TransactionPermission {
  roleId: string;
  canCreate: boolean;
  canEdit: boolean;
  canLock: boolean;
  canUnlock: boolean;
  canVerify: boolean;
  canDelete: boolean;
}

// Mock data for development
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
  },
];

export const mockRegister: Register = {
  id: 'r1',
  name: 'Main Register',
  isOpen: true,
  openedAt: '2023-06-01T08:00:00Z',
  openedBy: 'John Admin',
  openingBalance: {
    cash: 500,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0,
  },
  currentBalance: {
    cash: 625.50,
    card: 75.25,
    bank: 250,
    wave: 50.75,
    mobile: 0,
  },
  expectedBalance: {
    cash: 625.50,
    card: 75.25,
    bank: 250,
    wave: 50.75,
    mobile: 0,
  }
};

export const mockTransactionPermissions: TransactionPermission[] = [
  {
    roleId: 'r1', // Admin
    canCreate: true,
    canEdit: true,
    canLock: true,
    canUnlock: true,
    canVerify: true,
    canDelete: true,
  },
  {
    roleId: 'r2', // Manager
    canCreate: true,
    canEdit: true,
    canLock: true,
    canUnlock: true,
    canVerify: true,
    canDelete: false,
  },
  {
    roleId: 'r3', // Cashier
    canCreate: true,
    canEdit: false,
    canLock: true,
    canUnlock: false,
    canVerify: false,
    canDelete: false,
  },
];
