
export interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: 'open' | 'closed' | 'reconciled';
  notes?: string;
  reference_id?: string;
  reference_type?: string;
  location_id?: string;
  financial_year_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionFormData {
  description?: string;
  amount?: number;
  paymentMethod?: 'cash' | 'card' | 'bank' | 'wave' | 'mobile' | 'not_specified';
  branchId?: string;
}

export interface TransactionPermission {
  id: string;
  name: string;
  description: string;
  roleId: string;
  canCreate: boolean;
  canEdit: boolean;
  canLock: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReconcile: boolean;
  canViewSensitive: boolean;
  maxAmount: number;
}
