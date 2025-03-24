
export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface UserBusinessAssignment {
  userId: string;
  businessId: string;
  role: string;
  isDefault: boolean;
}

// Mock data for development purposes
export const mockBusinesses: Business[] = [
  {
    id: "bus-1",
    name: "Retail Store",
    logoUrl: "https://avatar.vercel.sh/retail",
    description: "Main retail operations",
    active: true,
    createdAt: "2023-01-15"
  },
  {
    id: "bus-2",
    name: "Warehouse Operations",
    logoUrl: "https://avatar.vercel.sh/warehouse",
    description: "Warehouse and distribution center",
    active: true,
    createdAt: "2023-02-20"
  },
  {
    id: "bus-3",
    name: "Online Store",
    logoUrl: "https://avatar.vercel.sh/online",
    description: "E-commerce operations",
    active: true,
    createdAt: "2023-03-10"
  }
];

export const mockUserBusinessAssignments: UserBusinessAssignment[] = [
  { userId: "user-admin", businessId: "bus-1", role: "admin", isDefault: true },
  { userId: "user-admin", businessId: "bus-2", role: "admin", isDefault: false },
  { userId: "user-admin", businessId: "bus-3", role: "admin", isDefault: false },
  { userId: "user-manager", businessId: "bus-1", role: "manager", isDefault: true },
  { userId: "user-manager", businessId: "bus-2", role: "manager", isDefault: false },
  { userId: "user-cashier", businessId: "bus-1", role: "cashier", isDefault: true }
];
