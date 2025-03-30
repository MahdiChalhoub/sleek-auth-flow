
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getBatchStatus } from '@/utils/expirationUtils';

interface BatchStatusBadgeProps {
  expiryDate: string;
}

const getBatchStatusColor = (status: string): string => {
  switch (status) {
    case 'fresh':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'expiring_soon':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    case 'expired':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'fresh':
      return 'Fresh';
    case 'expiring_soon':
      return 'Expiring Soon';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
};

const BatchStatusBadge: React.FC<BatchStatusBadgeProps> = ({ expiryDate }) => {
  const status = getBatchStatus(expiryDate);
  const colorClass = getBatchStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <Badge variant="outline" className={colorClass}>
      {label}
    </Badge>
  );
};

export default BatchStatusBadge;
