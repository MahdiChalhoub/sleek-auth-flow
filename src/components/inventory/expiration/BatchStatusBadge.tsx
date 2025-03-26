
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getBatchStatus, BatchStatus } from '@/utils/expirationUtils';

interface BatchStatusBadgeProps {
  expiryDate: string | null;
  className?: string;
}

const BatchStatusBadge: React.FC<BatchStatusBadgeProps> = ({ expiryDate, className }) => {
  if (!expiryDate) return null;
  
  const status = getBatchStatus(expiryDate);
  
  switch (status) {
    case 'fresh':
      return (
        <Badge variant="outline" className={`bg-green-100 text-green-800 flex items-center gap-1 ${className}`}>
          <CheckCircle className="h-3 w-3" />
          Frais
        </Badge>
      );
    case 'expiring_soon':
      return (
        <Badge variant="outline" className={`bg-amber-100 text-amber-800 flex items-center gap-1 ${className}`}>
          <Clock className="h-3 w-3" />
          Expire Bientôt
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline" className={`bg-red-100 text-red-800 flex items-center gap-1 ${className}`}>
          <AlertTriangle className="h-3 w-3" />
          Expiré
        </Badge>
      );
    default:
      return null;
  }
};

export default BatchStatusBadge;
