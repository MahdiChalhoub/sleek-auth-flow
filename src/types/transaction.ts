
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
  canReconcile: boolean;
  canViewSensitive?: boolean;
  maxAmount: number;
}

export interface TransactionFormData {
  type?: 'sale' | 'expense' | 'refund' | 'transfer' | string;
  description?: string;
  amount?: number;
  paymentMethod?: 'cash' | 'card' | 'bank' | 'wave' | 'mobile' | 'not_specified' | string;
  branchId?: string;
}
