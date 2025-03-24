
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, CheckCircle, ShieldCheck } from "lucide-react";
import { TransactionStatus } from "@/models/transaction";
import { cn } from "@/lib/utils";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  showIcon?: boolean;
  className?: string;
}

const TransactionStatusBadge = ({ status, showIcon = true, className }: TransactionStatusBadgeProps) => {
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "open":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
          icon: <Unlock className="h-3 w-3 mr-1" />,
          label: "Open"
        };
      case "locked":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
          icon: <Lock className="h-3 w-3 mr-1" />,
          label: "Locked"
        };
      case "verified":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Verified"
        };
      case "secure":
        return {
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30",
          icon: <ShieldCheck className="h-3 w-3 mr-1" />,
          label: "Secure"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/30",
          icon: null,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={cn("font-normal", config.color, className)}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};

export default TransactionStatusBadge;
