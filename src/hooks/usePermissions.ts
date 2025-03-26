
import { User, UserPermission } from "@/types/auth";

// Generate mock permissions for different roles
export const getMockPermissions = (role: User["role"]): UserPermission[] => {
  const basicPermissions: UserPermission[] = [
    { id: "1", name: "can_view_transactions", enabled: true },
    { id: "2", name: "can_view_inventory", enabled: true },
  ];
  
  const cashierPermissions: UserPermission[] = [
    ...basicPermissions,
    { id: "3", name: "can_edit_transactions", enabled: true },
    { id: "4", name: "can_apply_discount", enabled: false },
  ];
  
  const managerPermissions: UserPermission[] = [
    ...cashierPermissions,
    { id: "5", name: "can_lock_transactions", enabled: true },
    { id: "6", name: "can_unlock_transactions", enabled: true },
    { id: "7", name: "can_verify_transactions", enabled: true },
    { id: "8", name: "can_unverify_transactions", enabled: true },
    { id: "9", name: "can_approve_discrepancy", enabled: true },
    { id: "10", name: "can_apply_discount", enabled: true },
  ];
  
  const adminPermissions: UserPermission[] = [
    ...managerPermissions,
    { id: "11", name: "can_delete_transactions", enabled: true },
    { id: "12", name: "can_secure_transactions", enabled: true },
    { id: "13", name: "can_manage_users", enabled: true },
    { id: "14", name: "can_manage_roles", enabled: true },
    { id: "15", name: "can_manage_permissions", enabled: true },
  ];
  
  switch (role) {
    case "admin":
      return adminPermissions;
    case "manager":
      return managerPermissions;
    case "cashier":
      return cashierPermissions;
    default:
      return basicPermissions;
  }
};

// Helper function to get default page by role
export const getRoleDefaultPage = (role: User["role"]): string => {
  switch (role) {
    case "admin":
      return "/home";
    case "cashier":
      return "/pos-sales";
    case "manager":
      return "/inventory";
    default:
      return "/home";
  }
};
