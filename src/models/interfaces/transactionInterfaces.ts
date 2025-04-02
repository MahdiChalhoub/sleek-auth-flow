
export interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'refund' | 'transfer' | string;
  amount: number;
  status: 'open' | 'closed' | 'reconciled' | string;
  notes?: string;
  created_at?: string;
}

export interface TransactionFormData {
  type: 'sale' | 'expense' | 'refund' | 'transfer' | string;
  amount: number;
  notes?: string;
  businessId?: string;
  paymentMethod?: string;
  date?: string;
  category?: string;
  description?: string;
  branchId?: string;
}

export interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
}

export interface TransactionPermission {
  id: string;
  name: string;
  description: string;
  defaultRoles: string[];
  roleId: string;
  canCreate: boolean;
  canEdit: boolean;
  canLock: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
  canView: boolean;
  canReport: boolean;
}
