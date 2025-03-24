
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

// Mock data for initial development
export const permissionCategories = [
  "Sales",
  "Inventory",
  "Reports",
  "Settings",
  "Users"
];

export const mockPermissions: Permission[] = [
  { id: "p1", name: "Create Sale", description: "Can create new sales", category: "Sales", enabled: true },
  { id: "p2", name: "Apply Discount", description: "Can apply discounts to sales", category: "Sales", enabled: false },
  { id: "p3", name: "Void Sale", description: "Can void/delete sales", category: "Sales", enabled: false },
  { id: "p4", name: "View Reports", description: "Can view sales reports", category: "Reports", enabled: true },
  { id: "p5", name: "Export Reports", description: "Can export reports to CSV/PDF", category: "Reports", enabled: false },
  { id: "p6", name: "Add Inventory", description: "Can add new inventory items", category: "Inventory", enabled: true },
  { id: "p7", name: "Update Inventory", description: "Can update inventory items", category: "Inventory", enabled: true },
  { id: "p8", name: "Delete Inventory", description: "Can delete inventory items", category: "Inventory", enabled: false },
  { id: "p9", name: "Manage Users", description: "Can manage system users", category: "Users", enabled: false },
  { id: "p10", name: "Manage Roles", description: "Can manage roles and permissions", category: "Users", enabled: false },
  { id: "p11", name: "System Settings", description: "Can change system settings", category: "Settings", enabled: false },
  { id: "p12", name: "View Sales History", description: "Can view sales history", category: "Sales", enabled: true },
];

export const mockRoles: Role[] = [
  {
    id: "r1",
    name: "Admin",
    description: "Full system access",
    permissions: mockPermissions.map(p => ({ ...p, enabled: true }))
  },
  {
    id: "r2",
    name: "Manager",
    description: "Can manage most aspects of the system",
    permissions: mockPermissions.map(p => {
      if (p.id === "p10" || p.id === "p11") {
        return { ...p, enabled: false };
      }
      return { ...p, enabled: true };
    })
  },
  {
    id: "r3",
    name: "Cashier",
    description: "Limited to sales operations",
    permissions: mockPermissions.map(p => {
      if (p.category === "Sales" && p.id !== "p3") {
        return { ...p, enabled: true };
      }
      if (p.id === "p4") {
        return { ...p, enabled: true };
      }
      return { ...p, enabled: false };
    })
  }
];

export const mockUsers: User[] = [
  { id: "u1", name: "John Admin", email: "admin@pos.com", roleId: "r1" },
  { id: "u2", name: "Mike Manager", email: "manager@pos.com", roleId: "r2" },
  { id: "u3", name: "Cathy Cashier", email: "cashier1@pos.com", roleId: "r3" },
  { id: "u4", name: "Chris Cashier", email: "cashier2@pos.com", roleId: "r3" },
];
