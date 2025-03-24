
import { Register, RegisterSession } from '../interfaces/registerInterfaces';

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
