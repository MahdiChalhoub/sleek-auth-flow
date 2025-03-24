
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager?: string;
  isActive: boolean;
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
}
