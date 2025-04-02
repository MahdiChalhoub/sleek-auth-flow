
import { PaymentMethod } from '@/models/transaction';
import { Register, RegisterSession } from '../interfaces/registerInterfaces';

// Sample data for testing registers
export const mockRegisters: Register[] = [
  {
    id: 'reg1',
    name: 'Main Register',
    isOpen: true,
    openedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    openedBy: 'User1',
    openingBalance: {
      cash: 500,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 750,
      card: 200,
      bank: 0,
      wave: 100,
      mobile: 50,
      not_specified: 0
    },
    expectedBalance: {
      cash: 750,
      card: 200,
      bank: 0,
      wave: 100,
      mobile: 50,
      not_specified: 0
    }
  },
  {
    id: 'reg2',
    name: 'Secondary Register',
    isOpen: false,
    openedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    closedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    openedBy: 'User2',
    closedBy: 'User2',
    openingBalance: {
      cash: 1000,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    currentBalance: {
      cash: 1200,
      card: 500,
      bank: 0,
      wave: 200,
      mobile: 0,
      not_specified: 0
    },
    expectedBalance: {
      cash: 1250,
      card: 500,
      bank: 0,
      wave: 200,
      mobile: 0,
      not_specified: 0
    },
    discrepancies: {
      cash: -50,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    },
    discrepancyResolution: 'pending'
  }
];
