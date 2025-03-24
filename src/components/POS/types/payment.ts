
import { PaymentMethod } from "@/models/transaction";
import { Client } from "@/models/client";

export interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: (paymentDetails: {
    methods: Record<PaymentMethod, number>;
    totalPaid: number;
    change: number;
    useCredit?: boolean;
    usePoints?: boolean;
    pointsUsed?: number;
  }) => void;
  selectedClient?: {
    name: string;
    isVip?: boolean;
    creditLimit?: number;
    outstandingBalance?: number;
    loyaltyPoints?: number;
  } | null;
}

export interface ClientInfoProps {
  selectedClient: NonNullable<PaymentMethodSelectorProps["selectedClient"]>;
  useCredit: boolean;
  setUseCredit: (value: boolean) => void;
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  amount: number;
  hasAvailableCredit: boolean;
  isClientBlocked: boolean;
  canUsePoints: boolean;
  clientPoints: number;
  pointsWorth: number;
  availableCredit: number;
  maxPointsRedemption: number;
}

export interface PaymentSummaryProps {
  amount: number;
  selectedMethods: Record<PaymentMethod, number>;
  remainingAmount: number;
  changeAmount: number;
  useCredit: boolean;
  usePoints: boolean;
  canUsePoints: boolean;
  pointsWorth: number;
  maxPointsRedemption: number;
}

export interface PaymentTabsProps {
  activeTab: PaymentMethod;
  setActiveTab: (value: PaymentMethod) => void;
  selectedMethods: Record<PaymentMethod, number>;
  handleAmountChange: (method: PaymentMethod, value: string) => void;
  handleFullPayment: (method: PaymentMethod) => void;
  handleSplitPayment: (method: PaymentMethod) => void;
  remainingAmount: number;
}
