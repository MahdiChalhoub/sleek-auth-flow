
export interface TransactionPermission {
  roleId: string;
  canCreate: boolean;
  canEdit: boolean;
  canLock: boolean;
  canUnlock: boolean;
  canVerify: boolean;
  canUnverify: boolean;
  canDelete: boolean;
  canViewReports: boolean;
}

export interface StaffFinancePermission {
  roleId: string;
  canViewPayroll: boolean;
  canProcessPayroll: boolean;
  canViewExpenses: boolean;
  canApproveExpenses: boolean;
  canManageBenefits: boolean;
}

export interface LoyaltyPermission {
  roleId: string;
  canViewPrograms: boolean;
  canCreatePrograms: boolean;
  canEditPrograms: boolean;
  canDeletePrograms: boolean;
  canViewRewards: boolean;
  canIssueRewards: boolean;
}
