
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/models/payment';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'paid':
      return (
        <Badge variant="outline" className={`bg-green-100 text-green-800 flex items-center gap-1 px-2 ${className}`}>
          <Check className="h-3 w-3" />
          Payé
        </Badge>
      );
    case 'partially_paid':
      return (
        <Badge variant="outline" className={`bg-amber-100 text-amber-800 flex items-center gap-1 px-2 ${className}`}>
          <Clock className="h-3 w-3" />
          Partiellement payé
        </Badge>
      );
    case 'unpaid':
      return (
        <Badge variant="outline" className={`bg-red-100 text-red-800 flex items-center gap-1 px-2 ${className}`}>
          <AlertCircle className="h-3 w-3" />
          Non payé
        </Badge>
      );
    default:
      return null;
  }
};

export default PaymentStatusBadge;
