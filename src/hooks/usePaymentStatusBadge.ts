
import { PaymentStatus } from "@/models/payment";

export const usePaymentStatusBadge = () => {
  const getStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return {
          variant: 'outline',
          className: 'bg-green-100 text-green-800',
          icon: 'Check',
          label: 'Payé'
        };
      case 'partially_paid':
        return {
          variant: 'outline',
          className: 'bg-amber-100 text-amber-800',
          icon: 'Clock',
          label: 'Partiellement payé'
        };
      case 'unpaid':
        return {
          variant: 'outline',
          className: 'bg-red-100 text-red-800',
          icon: 'AlertCircle',
          label: 'Non payé'
        };
      default:
        return null;
    }
  };

  return { getStatusVariant };
};
