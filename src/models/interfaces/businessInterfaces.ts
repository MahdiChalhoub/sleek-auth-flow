
export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  type?: string;
  country?: string;
  currency?: string;
  defaultTaxSettings?: {
    salesTax: number;
    otherTaxes: {
      name: string;
      rate: number;
    }[];
  };
  timezone?: string;
}

export interface UserBusinessAssignment {
  userId: string;
  businessId: string;
  role: string;
  isDefault: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  businessId: string;
  type: "store" | "warehouse" | "pickup";
  phone?: string;
  email?: string;
  managerId?: string;
  status: "active" | "maintenance" | "inactive";
  isDefault?: boolean;
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  locationCode?: string;
  latitude?: number;
  longitude?: number;
}

// Mock data for development purposes
export const mockBusinesses: Business[] = [
  {
    id: "bus-1",
    name: "Retail Store",
    logoUrl: "https://avatar.vercel.sh/retail",
    description: "Main retail operations",
    active: true,
    createdAt: "2023-01-15",
    type: "Retail",
    country: "United States",
    currency: "USD",
    timezone: "America/New_York"
  },
  {
    id: "bus-2",
    name: "Warehouse Operations",
    logoUrl: "https://avatar.vercel.sh/warehouse",
    description: "Warehouse and distribution center",
    active: true,
    createdAt: "2023-02-20",
    type: "Wholesale",
    country: "Canada",
    currency: "CAD",
    timezone: "America/Toronto"
  },
  {
    id: "bus-3",
    name: "Online Store",
    logoUrl: "https://avatar.vercel.sh/online",
    description: "E-commerce operations",
    active: true,
    createdAt: "2023-03-10",
    type: "Retail",
    country: "United Kingdom",
    currency: "GBP",
    timezone: "Europe/London"
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

export const mockBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Downtown Store",
    businessId: "bus-1",
    type: "store",
    address: "123 Main St, New York, NY",
    phone: "+1 (555) 123-4567",
    email: "downtown@retailstore.com",
    managerId: "user-manager",
    status: "active",
    isDefault: true,
    openingHours: {
      monday: "9:00-21:00",
      tuesday: "9:00-21:00",
      wednesday: "9:00-21:00",
      thursday: "9:00-21:00",
      friday: "9:00-22:00",
      saturday: "10:00-22:00",
      sunday: "10:00-20:00"
    },
    locationCode: "NYC-001"
  },
  {
    id: "branch-2",
    name: "Midtown Pickup Point",
    businessId: "bus-1",
    type: "pickup",
    address: "456 Park Ave, New York, NY",
    phone: "+1 (555) 987-6543",
    email: "pickup@retailstore.com",
    managerId: "user-cashier",
    status: "active",
    openingHours: {
      monday: "10:00-20:00",
      tuesday: "10:00-20:00",
      wednesday: "10:00-20:00",
      thursday: "10:00-20:00",
      friday: "10:00-20:00",
      saturday: "10:00-18:00",
      sunday: "closed"
    },
    locationCode: "NYC-002"
  },
  {
    id: "branch-3",
    name: "Main Warehouse",
    businessId: "bus-2",
    type: "warehouse",
    address: "789 Industrial Blvd, Toronto, ON",
    phone: "+1 (555) 456-7890",
    email: "warehouse@warehouse.com",
    managerId: "user-manager",
    status: "active",
    openingHours: {
      monday: "8:00-18:00",
      tuesday: "8:00-18:00",
      wednesday: "8:00-18:00",
      thursday: "8:00-18:00",
      friday: "8:00-18:00",
      saturday: "9:00-15:00",
      sunday: "closed"
    },
    locationCode: "TOR-001"
  },
  {
    id: "branch-4",
    name: "London Flagship Store",
    businessId: "bus-3",
    type: "store",
    address: "10 Oxford St, London, UK",
    phone: "+44 20 1234 5678",
    email: "london@onlinestore.com",
    managerId: "user-manager",
    status: "maintenance",
    openingHours: {
      monday: "9:00-20:00",
      tuesday: "9:00-20:00",
      wednesday: "9:00-20:00",
      thursday: "9:00-20:00",
      friday: "9:00-21:00",
      saturday: "9:00-21:00",
      sunday: "11:00-17:00"
    },
    locationCode: "LON-001"
  }
];
