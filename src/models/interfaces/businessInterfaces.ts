
export interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  logoUrl?: string;
  description?: string;
  type?: string;
  country?: string;
  currency?: string;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
  businessId?: string;
  type?: string;
  status?: string;
  email?: string;
  isDefault?: boolean;
  managerId?: string;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

// Mock data for business and branches
export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Main Business",
    active: true,
    logoUrl: "/assets/images/logo.png",
    description: "Main business operations",
    type: "Retail",
    country: "United States",
    currency: "USD"
  },
  {
    id: "2",
    name: "Secondary Business",
    active: false,
    logoUrl: "/assets/images/logo2.png",
    description: "Secondary business division",
    type: "Wholesale",
    country: "Canada",
    currency: "CAD"
  }
];

export const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Downtown Branch",
    address: "123 Main St",
    phone: "+1234567890",
    isActive: true,
    businessId: "1",
    type: "store",
    status: "active",
    email: "downtown@example.com",
    isDefault: true,
    openingHours: {
      monday: "9:00 - 17:00",
      tuesday: "9:00 - 17:00",
      wednesday: "9:00 - 17:00",
      thursday: "9:00 - 17:00",
      friday: "9:00 - 17:00",
      saturday: "10:00 - 15:00",
      sunday: "Closed"
    }
  },
  {
    id: "2",
    name: "Uptown Branch",
    address: "456 High St",
    phone: "+1987654321",
    isActive: true,
    businessId: "1",
    type: "warehouse",
    status: "active",
    email: "uptown@example.com",
    isDefault: false
  }
];
