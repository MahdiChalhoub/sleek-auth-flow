
export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  storage: 'local' | 'cloud';
  cloudProvider?: 'dropbox' | 'google_drive' | 'custom';
  cloudSettings?: {
    apiKey?: string;
    folderPath?: string;
    customUrl?: string;
  };
  lastBackupTime?: string;
  lastBackupSize?: number; // in bytes
  lastBackupStatus?: 'success' | 'failed';
  retentionPeriod?: number; // days
}
