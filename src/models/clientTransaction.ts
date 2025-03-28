
export interface ClientTransaction {
  id: string;
  clientId: string;
  type: 'invoice' | 'payment' | 'return' | 'credit' | 'debit';
  referenceId: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  createdAt: string;
  updatedAt: string;
}
