
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
