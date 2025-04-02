
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
  createdAt?: string; // Adding createdAt for compatibility
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
    timezone: "America/New_York",
    createdAt: new Date().toISOString()
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
    timezone: "America/Toronto",
    createdAt: new Date().toISOString()
  }
];

// Add mockBranches for components that need them
export const mockBranches: Branch[] = [
  {
    id: "b1",
    name: "Main Store",
    address: "123 Main Street, Anytown",
    phone: "+123456789",
    email: "main@example.com",
    managerId: "user-manager",
    status: "active",
    businessId: "bus-1",
    type: "store",
    isDefault: true,
    openingHours: {
      monday: "9:00 AM - 9:00 PM",
      tuesday: "9:00 AM - 9:00 PM",
      wednesday: "9:00 AM - 9:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "10:00 AM - 8:00 PM"
    },
    latitude: 34.0522,
    longitude: -118.2437,
    locationCode: "MAIN-01",
    timezone: "America/Los_Angeles"
  },
  {
    id: "b2",
    name: "Downtown Branch",
    address: "456 Commerce Ave, Downtown",
    phone: "+987654321",
    email: "downtown@example.com",
    managerId: "user-manager",
    status: "active",
    businessId: "bus-1",
    type: "store",
    isDefault: false,
    openingHours: {
      monday: "8:00 AM - 8:00 PM",
      tuesday: "8:00 AM - 8:00 PM",
      wednesday: "8:00 AM - 8:00 PM",
      thursday: "8:00 AM - 8:00 PM",
      friday: "8:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "11:00 AM - 7:00 PM"
    },
    latitude: 34.0407,
    longitude: -118.2468,
    locationCode: "DOWN-02",
    timezone: "America/Los_Angeles"
  },
  {
    id: "b3",
    name: "Westside Mini Market",
    address: "789 Ocean Blvd, Westside",
    phone: "+192837465",
    email: "westside@example.com",
    managerId: "user-supervisor",
    status: "active",
    businessId: "bus-2",
    type: "store",
    isDefault: false,
    openingHours: {
      monday: "7:00 AM - 11:00 PM",
      tuesday: "7:00 AM - 11:00 PM",
      wednesday: "7:00 AM - 11:00 PM",
      thursday: "7:00 AM - 11:00 PM",
      friday: "7:00 AM - 12:00 AM",
      saturday: "8:00 AM - 12:00 AM",
      sunday: "8:00 AM - 10:00 PM"
    },
    latitude: 34.0522,
    longitude: -118.4441,
    locationCode: "WEST-03",
    timezone: "America/Los_Angeles"
  }
];
