
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  businessId: string;
  status: 'active' | 'inactive' | 'pending' | 'closed';
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  createdAt: string;
  updatedAt: string;
  openingHours?: Record<string, string> | string;
}

export interface LocationFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  openingHours?: Record<string, string> | string;
}

// Alias Location to Branch for backwards compatibility
export type Location = Branch;

// Helper type for OpeningHours 
export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

// Helper function to convert string to OpeningHours object
export const parseOpeningHours = (hours: string | Record<string, string> | undefined): OpeningHours => {
  const defaultHours: OpeningHours = {
    monday: '9:00-18:00',
    tuesday: '9:00-18:00',
    wednesday: '9:00-18:00',
    thursday: '9:00-18:00',
    friday: '9:00-18:00',
    saturday: '10:00-16:00',
    sunday: 'closed'
  };
  
  if (!hours) {
    return defaultHours;
  }
  
  if (typeof hours === 'string') {
    try {
      const parsed = JSON.parse(hours);
      return {
        ...defaultHours,
        ...parsed
      };
    } catch (e) {
      return defaultHours;
    }
  }
  
  // If it's already a record, ensure it has all required fields
  return {
    monday: hours.monday || defaultHours.monday,
    tuesday: hours.tuesday || defaultHours.tuesday,
    wednesday: hours.wednesday || defaultHours.wednesday,
    thursday: hours.thursday || defaultHours.thursday,
    friday: hours.friday || defaultHours.friday,
    saturday: hours.saturday || defaultHours.saturday,
    sunday: hours.sunday || defaultHours.sunday
  };
};
