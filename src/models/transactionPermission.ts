
export interface TransactionPermission {
  id: string;
  userId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewSensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockTransactionPermissions: TransactionPermission[] = [
  {
    id: "perm-1",
    userId: "user-001",
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canViewSensitive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "perm-2",
    userId: "user-002",
    canView: true,
    canCreate: true,
    canEdit: false,
    canDelete: false,
    canViewSensitive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "perm-3",
    userId: "user-003",
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewSensitive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
