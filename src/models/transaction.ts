export type TransactionStatus = 'pending' | 'open' | 'locked' | 'verified' | 'unverified' | 'secure';
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'wave' | 'mobile';
export type DiscrepancyResolution = 'pending' | 'approved' | 'deduct_salary' | 'ecart_caisse' | 'rejected';

export type AccountType = 
  'cash' | 'bank' | 'inventory' | 'revenue' | 'expense' | 
  'accounts_receivable' | 'accounts_payable' | 'equity' | 
  'assets' | 'liabilities' | 'salaries' | 'taxes';

export type TransactionType = 
  'sale' | 'purchase' | 'return_sale' | 'return_purchase' | 
  'payment_received' | 'payment_made' | 'expense' | 'transfer' | 
  'adjustment' | 'salary' | 'cash_in' | 'cash_out';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountType: AccountType;
  amount: number;
  isDebit: boolean;
  description: string;
  createdAt: string;
  createdBy: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface JournalTransaction {
  id: string;
  date: string;
  transactionType: TransactionType;
  description: string;
  entries: LedgerEntry[];
  createdBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  reference?: string;
}

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
  journalEntries?: LedgerEntry[];
  branchId?: string;
  clientId?: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
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

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager?: string;
  isActive: boolean;
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude?: number;
  longitude?: number;
}

export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  storage: 'local' | 'cloud';
  cloudProvider?: 'dropbox' | 'google_drive' | 'custom';
  cloudSettings?: {
    apiKey?: string;
    folderPath?: string;
    customUrl?: string;
  };
  lastBackupTime?: string;
  lastBackupSize?: number; // in bytes
  lastBackupStatus?: 'success' | 'failed';
  retentionPeriod?: number; // days
}

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

export const mockBranches: Branch[] = [
  {
    id: "b1",
    name: "Main Store",
    address: "123 Main Street, Anytown",
    phone: "+123456789",
    email: "main@example.com",
    manager: "John Admin",
    isActive: true,
    openingHours: {
      monday: "9:00 AM - 9:00 PM",
      tuesday: "9:00 AM - 9:00 PM",
      wednesday: "9:00 AM - 9:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "10:00 AM - 8:00 PM"
    },
    latitude: 34.0522,
    longitude: -118.2437
  },
  {
    id: "b2",
    name: "Downtown Branch",
    address: "456 Commerce Ave, Downtown",
    phone: "+987654321",
    email: "downtown@example.com",
    manager: "Mike Manager",
    isActive: true,
    openingHours: {
      monday: "8:00 AM - 8:00 PM",
      tuesday: "8:00 AM - 8:00 PM",
      wednesday: "8:00 AM - 8:00 PM",
      thursday: "8:00 AM - 8:00 PM",
      friday: "8:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "11:00 AM - 7:00 PM"
    },
    latitude: 34.0407,
    longitude: -118.2468
  },
  {
    id: "b3",
    name: "Westside Mini Market",
    address: "789 Ocean Blvd, Westside",
    phone: "+192837465",
    email: "westside@example.com",
    manager: "Sarah Supervisor",
    isActive: true,
    openingHours: {
      monday: "7:00 AM - 11:00 PM",
      tuesday: "7:00 AM - 11:00 PM",
      wednesday: "7:00 AM - 11:00 PM",
      thursday: "7:00 AM - 11:00 PM",
      friday: "7:00 AM - 12:00 AM",
      saturday: "8:00 AM - 12:00 AM",
      sunday: "8:00 AM - 10:00 PM"
    },
    latitude: 34.0522,
    longitude: -118.4441
  }
];

export const mockBackupSettings: BackupSettings = {
  autoBackup: true,
  frequency: "daily",
  time: "02:00",
  storage: "cloud",
  cloudProvider: "google_drive",
  cloudSettings: {
    folderPath: "/pos_backups"
  },
  lastBackupTime: "2023-06-01T02:00:00Z",
  lastBackupSize: 1024 * 1024 * 5, // 5MB
  lastBackupStatus: "success",
  retentionPeriod: 30
};
