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
