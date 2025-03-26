import { v4 as uuidv4 } from 'uuid';
import { PaymentMethod } from './payment';

export type ExpenseStatus = 'due' | 'paid' | 'overdue';
export type ExpenseCategory = 'rent' | 'utilities' | 'salaries' | 'supplies' | 'marketing' | 'transportation' | 'maintenance' | 'insurance' | 'taxes' | 'other';

export interface ExpensePayment {
  id: string;
  expenseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  category: ExpenseCategory;
  amount: number;
  dueDate: string;
  status: ExpenseStatus;
  paymentMethod?: PaymentMethod;
  reference?: string;
  supplierId?: string;
  payments?: ExpensePayment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const createExpense = (data: Partial<Expense>): Expense => {
  const now = new Date().toISOString();
  return {
    id: data.id || uuidv4(),
    title: data.title || '',
    description: data.description,
    category: data.category || 'other',
    amount: data.amount || 0,
    dueDate: data.dueDate || now,
    status: data.status || 'due',
    paymentMethod: data.paymentMethod,
    reference: data.reference,
    supplierId: data.supplierId,
    payments: data.payments || [],
    notes: data.notes,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const calculateExpenseStatus = (expense: Expense): ExpenseStatus => {
  // Calculate total paid
  const totalPaid = expense.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  
  // Check if fully paid
  if (totalPaid >= expense.amount) {
    return 'paid';
  }
  
  // Check if overdue
  const today = new Date();
  const dueDate = new Date(expense.dueDate);
  
  if (dueDate < today) {
    return 'overdue';
  }
  
  // Otherwise, it's due
  return 'due';
};

export const getRemainingBalance = (expense: Expense): number => {
  const totalPaid = expense.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  return Math.max(0, expense.amount - totalPaid);
};

// Expenses service for Supabase
export const expensesService = {
  async getAll(): Promise<Expense[]> {
    // Implementation will be added later
    return [];
  },
  
  async getById(id: string): Promise<Expense | null> {
    // Implementation will be added later
    return null;
  },
  
  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense | null> {
    // Implementation will be added later
    return null;
  },
  
  async update(id: string, updates: Partial<Expense>): Promise<Expense | null> {
    // Implementation will be added later
    return null;
  },
  
  async delete(id: string): Promise<boolean> {
    // Implementation will be added later
    return false;
  },
  
  async addPayment(expenseId: string, payment: Omit<ExpensePayment, 'id' | 'expenseId' | 'createdAt' | 'updatedAt'>): Promise<ExpensePayment | null> {
    // Implementation will be added later
    return null;
  },
  
  async getExpensePayments(expenseId: string): Promise<ExpensePayment[]> {
    // Implementation will be added later
    return [];
  }
};
