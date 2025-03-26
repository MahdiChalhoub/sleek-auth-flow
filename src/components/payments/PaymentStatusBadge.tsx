
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/models/payment';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { usePaymentStatusBadge } from '@/hooks/usePaymentStatusBadge';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  const { getStatusVariant } = usePaymentStatusBadge();
  const statusConfig = getStatusVariant(status);
  
  if (!statusConfig) return null;
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 px-2 ${statusConfig.className} ${className}`}
    >
      {statusConfig.icon === 'Check' && <Check className="h-3 w-3" />}
      {statusConfig.icon === 'Clock' && <Clock className="h-3 w-3" />}
      {statusConfig.icon === 'AlertCircle' && <AlertCircle className="h-3 w-3" />}
      {statusConfig.label}
    </Badge>
  );
};

export default PaymentStatusBadge;
