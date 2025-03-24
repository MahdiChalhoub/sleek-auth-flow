
import { Branch } from '../interfaces/branchInterfaces';
import { BackupSettings } from '../interfaces/backupInterfaces';

export const mockBranches: Branch[] = [
  {
    id: "b1",
    name: "Main Store",
    address: "123 Main Street, Anytown",
    phone: "+123456789",
    email: "main@example.com",
    managerId: "user-manager", // Changed from manager to managerId
    status: "active", // Added status field which is required
    businessId: "bus-1", // Added businessId which is required
    type: "store", // Added type which is required
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
    longitude: -118.2437
  },
  {
    id: "b2",
    name: "Downtown Branch",
    address: "456 Commerce Ave, Downtown",
    phone: "+987654321",
    email: "downtown@example.com",
    managerId: "user-manager", // Changed from manager to managerId
    status: "active", // Added status field which is required
    businessId: "bus-1", // Added businessId which is required
    type: "store", // Added type which is required
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
    longitude: -118.2468
  },
  {
    id: "b3",
    name: "Westside Mini Market",
    address: "789 Ocean Blvd, Westside",
    phone: "+192837465",
    email: "westside@example.com",
    managerId: "user-supervisor", // Changed from manager to managerId
    status: "active", // Added status field which is required
    businessId: "bus-2", // Added businessId which is required
    type: "store", // Added type which is required
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
    longitude: -118.4441
  }
];

export const mockBackupSettings: BackupSettings = {
  autoBackup: true,
  frequency: "daily",
  time: "02:00",
  storage: "cloud",
  cloudProvider: "google_drive",
  cloudSettings: {
    folderPath: "/pos_backups"
  },
  lastBackupTime: "2023-06-01T02:00:00Z",
  lastBackupSize: 1024 * 1024 * 5, // 5MB
  lastBackupStatus: "success",
  retentionPeriod: 30
};
