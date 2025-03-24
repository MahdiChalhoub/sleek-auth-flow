
export type TransactionStatus = 'pending' | 'open' | 'locked' | 'verified' | 'unverified' | 'secure';
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'wave' | 'mobile';
export type DiscrepancyResolution = 'pending' | 'approved' | 'deduct_salary' | 'ecart_caisse' | 'rejected';

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
  verifiedBy?: string;
  verifiedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
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
  discrepancies?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  discrepancyResolution?: DiscrepancyResolution;
  discrepancyApprovedBy?: string;
  discrepancyApprovedAt?: string;
  discrepancyNotes?: string;
}

export interface RegisterSession {
  id: string;
  registerId: string;
  cashierId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingBalance: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  closingBalance?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  expectedBalance?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  discrepancies?: {
    cash: number;
    card: number;
    bank: number;
    wave: number;
    mobile: number;
  };
  discrepancyResolution?: DiscrepancyResolution;
  discrepancyApprovedBy?: string;
  discrepancyApprovedAt?: string;
  discrepancyNotes?: string;
}

export interface TransactionPermission {
  roleId: string;
  canCreate: boolean;
  canEdit: boolean;
  canLock: boolean;
  canUnlock: boolean;
  canVerify: boolean;
  canUnverify: boolean;
  canDelete: boolean;
  canViewReports: boolean;
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

export const mockRegisterSessions: RegisterSession[] = [
  {
    id: "rs1",
    registerId: "r1",
    cashierId: "c1",
    cashierName: "John Doe",
    openedAt: "2023-06-01T08:00:00Z",
    closedAt: "2023-06-01T17:00:00Z",
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
    },
    closingBalance: {
      cash: 1200.50,
      card: 350.75,
      bank: 125.25,
      wave: 75.00,
      mobile: 0,
    },
    expectedBalance: {
      cash: 1225.50,
      card: 350.75,
      bank: 125.25,
      wave: 75.00,
      mobile: 0,
    },
    discrepancies: {
      cash: -25.00,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
    },
    discrepancyResolution: "deduct_salary",
    discrepancyApprovedBy: "Admin User",
    discrepancyApprovedAt: "2023-06-01T17:30:00Z",
    discrepancyNotes: "Cashier agreed to deduction from salary"
  },
  {
    id: "rs2",
    registerId: "r1",
    cashierId: "c2",
    cashierName: "Jane Smith",
    openedAt: "2023-06-02T08:00:00Z",
    closedAt: "2023-06-02T17:00:00Z",
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
    },
    closingBalance: {
      cash: 950.25,
      card: 425.50,
      bank: 200.00,
      wave: 150.75,
      mobile: 50.00,
    },
    expectedBalance: {
      cash: 950.25,
      card: 425.50,
      bank: 200.00,
      wave: 150.75,
      mobile: 50.00,
    },
    discrepancies: {
      cash: 0,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
    }
  },
  {
    id: "rs3",
    registerId: "r1",
    cashierId: "c3",
    cashierName: "Bob Johnson",
    openedAt: "2023-06-03T08:00:00Z",
    closedAt: "2023-06-03T17:00:00Z",
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
    },
    closingBalance: {
      cash: 1075.00,
      card: 525.25,
      bank: 150.50,
      wave: 200.00,
      mobile: 75.25,
    },
    expectedBalance: {
      cash: 1100.00,
      card: 525.25,
      bank: 150.50,
      wave: 200.00,
      mobile: 75.25,
    },
    discrepancies: {
      cash: -25.00,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
    },
    discrepancyResolution: "ecart_caisse",
    discrepancyApprovedBy: "Admin User",
    discrepancyApprovedAt: "2023-06-03T17:45:00Z",
    discrepancyNotes: "Small discrepancy assigned to Écart de Caisse"
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
