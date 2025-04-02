
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  status: 'active' | 'inactive';
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
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "branch-002",
    name: "Downtown Branch",
    address: "456 Downtown Avenue",
    phone: "+1234567891",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "branch-003",
    name: "Uptown Branch",
    address: "789 Uptown Boulevard",
    phone: "+1234567892",
    status: "inactive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
