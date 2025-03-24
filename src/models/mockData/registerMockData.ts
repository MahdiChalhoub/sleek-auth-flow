import { Register, RegisterSession, DiscrepancyResolution } from '../types/transactionTypes';

export const mockRegisters: Register[] = [
  {
    id: 'reg-001',
    name: 'Main Register',
    isOpen: true,
    openedAt: '2023-08-15T09:00:00Z',
    openedBy: 'user-001',
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 1250.75,
      card: 850.25,
      bank: 300,
      wave: 125.50,
      mobile: 75,
      not_specified: 0
    },
    expectedBalance: {
      cash: 1250.75,
      card: 850.25,
      bank: 300,
      wave: 125.50,
      mobile: 75,
      not_specified: 0
    }
  },
  {
    id: 'reg-002',
    name: 'Secondary Register',
    isOpen: false,
    openedAt: '2023-08-14T08:30:00Z',
    closedAt: '2023-08-14T17:30:00Z',
    openedBy: 'user-003',
    closedBy: 'user-003',
    openingBalance: {
      cash: 300,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 850.25,
      card: 1200.75,
      bank: 350,
      wave: 75,
      mobile: 125,
      not_specified: 0
    },
    expectedBalance: {
      cash: 855,
      card: 1200.75,
      bank: 350,
      wave: 75,
      mobile: 125,
      not_specified: 0
    },
    discrepancies: {
      cash: -4.75,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    discrepancyResolution: 'approved',
    discrepancyApprovedBy: 'user-001',
    discrepancyApprovedAt: '2023-08-14T17:45:00Z',
    discrepancyNotes: 'Small discrepancy approved after investigation.'
  },
  {
    id: 'reg-003',
    name: 'Mobile Register',
    isOpen: false,
    openingBalance: {
      cash: 200,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 200,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    expectedBalance: {
      cash: 200,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    }
  }
];

export const mockRegisterSessions: RegisterSession[] = [
  {
    id: 'session-001',
    registerId: 'reg-001',
    cashierId: 'user-002',
    cashierName: 'John Cashier',
    openedAt: '2023-08-15T09:00:00Z',
    closedAt: '2023-08-15T17:00:00Z',
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    closingBalance: {
      cash: 1250.75,
      card: 850.25,
      bank: 300,
      wave: 125.50,
      mobile: 75,
      not_specified: 0
    },
    expectedBalance: {
      cash: 1253.25,
      card: 850.25,
      bank: 300,
      wave: 125.50,
      mobile: 75,
      not_specified: 0
    },
    discrepancies: {
      cash: -2.50,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    discrepancyResolution: 'deduct_salary',
    discrepancyApprovedBy: 'user-001',
    discrepancyApprovedAt: '2023-08-15T17:15:00Z',
    discrepancyNotes: 'Minor cash discrepancy deducted from employee salary.'
  },
  {
    id: 'session-002',
    registerId: 'reg-001',
    cashierId: 'user-003',
    cashierName: 'Jane Operator',
    openedAt: '2023-08-16T08:30:00Z',
    closedAt: '2023-08-16T16:30:00Z',
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    closingBalance: {
      cash: 1325.50,
      card: 975.25,
      bank: 450,
      wave: 200,
      mobile: 100,
      not_specified: 0
    },
    expectedBalance: {
      cash: 1325.50,
      card: 975.25,
      bank: 450,
      wave: 200,
      mobile: 100,
      not_specified: 0
    },
    discrepancies: {
      cash: 0,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    }
  },
  {
    id: 'session-003',
    registerId: 'reg-002',
    cashierId: 'user-004',
    cashierName: 'Alice Accountant',
    openedAt: '2023-08-15T08:45:00Z',
    closedAt: '2023-08-15T17:15:00Z',
    openingBalance: {
      cash: 300,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    closingBalance: {
      cash: 850.25,
      card: 1200.75,
      bank: 350,
      wave: 75,
      mobile: 125,
      not_specified: 0
    },
    expectedBalance: {
      cash: 855,
      card: 1200.75,
      bank: 350,
      wave: 75,
      mobile: 125,
      not_specified: 0
    },
    discrepancies: {
      cash: -4.75,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    discrepancyResolution: 'approved',
    discrepancyApprovedBy: 'user-001',
    discrepancyApprovedAt: '2023-08-15T17:30:00Z',
    discrepancyNotes: 'Small discrepancy approved after investigation.'
  }
];
