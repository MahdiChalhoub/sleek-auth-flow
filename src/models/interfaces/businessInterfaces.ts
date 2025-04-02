
export interface Business {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  ownerId?: string;
  active: boolean;
  type?: string;
  description?: string;
  logoUrl?: string;
  country?: string;
  currency?: string;
  timezone?: string;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  businessId: string;
  status: string;
  type: string;
  managerId?: string;
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
  latitude?: number;
  longitude?: number;
  locationCode?: string;
  timezone?: string;
}

// Add mock businesses for components that need them
export const mockBusinesses: Business[] = [
  {
    id: "bus-1",
    name: "Main Corporation",
    address: "123 Business Ave, Enterprise City",
    phone: "+1234567890",
    ownerId: "user-owner",
    active: true,
    type: "retail",
    description: "Main retail business offering various products",
    logoUrl: "/images/business-logo.png",
    country: "United States",
    currency: "USD",
    timezone: "America/New_York"
  },
  {
    id: "bus-2",
    name: "Secondary Ventures",
    address: "456 Venture Blvd, Business Town",
    phone: "+0987654321",
    ownerId: "user-owner",
    active: true,
    type: "wholesale",
    description: "Wholesale business for bulk purchases",
    logoUrl: "/images/secondary-logo.png",
    country: "Canada",
    currency: "CAD",
    timezone: "America/Toronto"
  }
];
