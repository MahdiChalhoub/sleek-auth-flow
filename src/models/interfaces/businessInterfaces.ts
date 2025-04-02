
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  type?: 'store' | 'warehouse' | 'pickup';
  status: 'active' | 'inactive';
  isDefault?: boolean;
  businessId?: string;
  managerId?: string;
  locationCode?: string;
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Business {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  logoUrl?: string;
  description?: string;
  type?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data for businesses
export const mockBusinesses: Business[] = [
  {
    id: "business-001",
    name: "Acme Corporation",
    address: "123 Business Ave",
    phone: "+1234567890",
    email: "info@acme.com",
    website: "https://www.acme.com",
    logoUrl: "",
    description: "Leading provider of innovative solutions",
    type: "Retail",
    country: "United States",
    currency: "USD",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "business-002",
    name: "Globex Inc",
    address: "456 Corporate Blvd",
    phone: "+1987654321",
    email: "contact@globex.com",
    website: "https://www.globex.com",
    logoUrl: "",
    description: "Global export solutions",
    type: "Wholesale",
    country: "United Kingdom",
    currency: "GBP",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock data for branches
export const mockBranches: Branch[] = [
  {
    id: "branch-001",
    name: "Main Branch",
    address: "123 Main Street",
    phone: "+1234567890",
    email: "main@example.com",
    type: "store",
    status: "active",
    isDefault: true,
    businessId: "business-001",
    managerId: "user-manager",
    locationCode: "MB-001",
    openingHours: {
      monday: "9:00-18:00",
      tuesday: "9:00-18:00",
      wednesday: "9:00-18:00",
      thursday: "9:00-18:00",
      friday: "9:00-18:00",
      saturday: "10:00-16:00",
      sunday: "closed"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "branch-002",
    name: "Downtown Branch",
    address: "456 Downtown Avenue",
    phone: "+1234567891",
    email: "downtown@example.com",
    type: "store",
    status: "active",
    isDefault: false,
    businessId: "business-001",
    managerId: "user-cashier",
    locationCode: "DB-002",
    openingHours: {
      monday: "9:00-18:00",
      tuesday: "9:00-18:00",
      wednesday: "9:00-18:00",
      thursday: "9:00-18:00",
      friday: "9:00-18:00",
      saturday: "10:00-16:00",
      sunday: "closed"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "branch-003",
    name: "Uptown Branch",
    address: "789 Uptown Boulevard",
    phone: "+1234567892",
    email: "uptown@example.com",
    type: "warehouse",
    status: "inactive",
    isDefault: false,
    businessId: "business-002",
    managerId: "",
    locationCode: "UB-003",
    openingHours: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
