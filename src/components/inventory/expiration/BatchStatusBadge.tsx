
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getBatchStatus, getBatchStatusColor } from '@/utils/expirationUtils';

interface BatchStatusBadgeProps {
  expiryDate: string | null;
}

const BatchStatusBadge: React.FC<BatchStatusBadgeProps> = ({ expiryDate }) => {
  const status = getBatchStatus(expiryDate);
  const colorClass = getBatchStatusColor(status);
  
  let label = '';
  switch (status) {
    case 'fresh':
      label = 'Frais';
      break;
    case 'expiring_soon':
      label = 'Expire bientôt';
      break;
    case 'expired':
      label = 'Expiré';
      break;
    default:
      label = 'Inconnu';
  }
  
  return (
    <Badge variant="outline" className={`${colorClass} font-medium`}>
      {label}
    </Badge>
  );
};

export default BatchStatusBadge;
