
// Helper function to map database status to our internal status
export function mapDatabaseStatus(status: string): "draft" | "sent" | "verified" | "cancelled" {
  switch (status) {
    case 'pending': return 'draft';
    case 'in-transit': return 'sent';
    case 'completed': return 'verified';
    case 'cancelled': return 'cancelled';
    default: return 'draft';
  }
}

// Helper function to map our internal status to database status
export function mapToDbStatus(status: "draft" | "sent" | "verified" | "cancelled"): string {
  switch (status) {
    case 'draft': return 'pending';
    case 'sent': return 'in-transit';
    case 'verified': return 'completed';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
}
