
export type PaymentStatus = 'paid' | 'unpaid' | 'partially_paid';

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'check' | 'credit';

export type InvoiceType = 'sale' | 'purchase' | 'expense';

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceType: InvoiceType;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditNote {
  id: string;
  invoiceId: string;
  invoiceType: InvoiceType;
  amount: number;
  reason: string;
  status: 'applied' | 'pending';
  refundMethod?: PaymentMethod;
  isRefunded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DebitNote {
  id: string;
  invoiceId: string;
  invoiceType: InvoiceType;
  amount: number;
  reason: string;
  status: 'applied' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface RecurringExpense {
  id: string;
  title: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  customDays?: number;
  startDate: string;
  endDate?: string;
  isAutoPaid: boolean;
  paymentMethod?: PaymentMethod;
  lastProcessedDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for initial development
export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    invoiceId: "inv-1",
    invoiceType: "sale",
    amount: 500.00,
    paymentMethod: "cash",
    paymentDate: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: "pay-2",
    invoiceId: "inv-1",
    invoiceType: "sale",
    amount: 250.00,
    paymentMethod: "card",
    paymentDate: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: "pay-3",
    invoiceId: "inv-2",
    invoiceType: "purchase",
    amount: 1200.00,
    paymentMethod: "bank_transfer",
    paymentDate: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
];

export const mockCreditNotes: CreditNote[] = [
  {
    id: "cn-1",
    invoiceId: "inv-1",
    invoiceType: "sale",
    amount: 50.00,
    reason: "Product returned in damaged condition",
    status: "applied",
    refundMethod: "cash",
    isRefunded: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "cn-2",
    invoiceId: "inv-3",
    invoiceType: "purchase",
    amount: 120.00,
    reason: "Incorrect pricing on invoice",
    status: "pending",
    isRefunded: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
];

export const mockDebitNotes: DebitNote[] = [
  {
    id: "dn-1",
    invoiceId: "inv-2",
    invoiceType: "purchase",
    amount: 75.00,
    reason: "Additional service fee",
    status: "applied",
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
];

export const mockRecurringExpenses: RecurringExpense[] = [
  {
    id: "rec-1",
    title: "Office Rent",
    amount: 1500.00,
    frequency: "monthly",
    startDate: new Date(Date.now() - 3600000 * 24 * 30 * 3).toISOString(),
    isAutoPaid: true,
    paymentMethod: "bank_transfer",
    lastProcessedDate: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    notes: "Paid on the 1st of each month",
    isActive: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 30 * 3).toISOString(),
  },
  {
    id: "rec-2",
    title: "Software Subscription",
    amount: 99.00,
    frequency: "monthly",
    startDate: new Date(Date.now() - 3600000 * 24 * 30 * 2).toISOString(),
    endDate: new Date(Date.now() + 3600000 * 24 * 30 * 10).toISOString(),
    isAutoPaid: true,
    paymentMethod: "card",
    lastProcessedDate: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    isActive: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 30 * 2).toISOString(),
  },
  {
    id: "rec-3",
    title: "Cleaning Service",
    amount: 200.00,
    frequency: "weekly",
    startDate: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    isAutoPaid: false,
    lastProcessedDate: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    isActive: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
];
