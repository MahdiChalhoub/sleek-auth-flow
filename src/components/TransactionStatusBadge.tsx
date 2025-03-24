
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Unlock, CheckCircle, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { TransactionStatus } from "@/models/transaction";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  showIcon?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const TransactionStatusBadge = ({ 
  status, 
  showIcon = true, 
  showTooltip = false,
  className 
}: TransactionStatusBadgeProps) => {
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/30",
          icon: <Clock className="h-3 w-3 mr-1" />,
          label: "Pending",
          description: "Transaction is editable and not yet finalized"
        };
      case "open":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
          icon: <Unlock className="h-3 w-3 mr-1" />,
          label: "Open",
          description: "Transaction can be edited by authorized users"
        };
      case "locked":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
          icon: <Lock className="h-3 w-3 mr-1" />,
          label: "Locked",
          description: "Transaction is locked and cannot be edited without unlocking"
        };
      case "verified":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          label: "Verified",
          description: "Transaction has been verified by an authorized user"
        };
      case "unverified":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          label: "Unverified",
          description: "Transaction was verified but has been marked as unverified"
        };
      case "secure":
        return {
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30",
          icon: <ShieldCheck className="h-3 w-3 mr-1" />,
          label: "Secure",
          description: "Transaction is secure and cannot be modified"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/30",
          icon: null,
          label: status,
          description: "Unknown transaction status"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip ? undefined : false}>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={cn("font-normal", config.color, className)}>
            {showIcon && config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TransactionStatusBadge;
