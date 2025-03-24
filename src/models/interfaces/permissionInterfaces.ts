
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
