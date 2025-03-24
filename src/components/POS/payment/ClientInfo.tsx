
import React from "react";
import { Button } from "@/components/ui/button";
import { User, AlertCircle, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ClientInfoProps } from "../types/payment";

const ClientInfo: React.FC<ClientInfoProps> = ({
  selectedClient,
  useCredit,
  setUseCredit,
  usePoints,
  setUsePoints,
  amount,
  hasAvailableCredit,
  isClientBlocked,
  canUsePoints,
  clientPoints,
  pointsWorth,
  availableCredit,
  maxPointsRedemption
}) => {
  return (
    <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-4 w-4" />
        <p className="font-medium">{selectedClient.name}</p>
        {selectedClient.isVip && (
          <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">VIP</span>
        )}
        {isClientBlocked && (
          <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Blocked
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-sm">
        {selectedClient.creditLimit !== undefined && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credit Limit:</span>
              <span>${selectedClient.creditLimit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outstanding:</span>
              <span>${selectedClient.outstandingBalance?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Available Credit:</span>
              <span className={availableCredit <= 0 ? "text-red-500" : "text-green-500"}>
                ${availableCredit.toFixed(2)}
              </span>
            </div>
          </>
        )}
        
        {clientPoints > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loyalty Points:</span>
              <span className="text-purple-500 font-medium">{clientPoints} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Points Value:</span>
              <span>${(clientPoints * 0.01).toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-2 flex flex-col gap-2">
        {hasAvailableCredit && !isClientBlocked && (
          <Button 
            variant={useCredit ? "default" : "outline"} 
            size="sm" 
            className="w-full"
            onClick={() => {
              setUseCredit(!useCredit);
              if (!useCredit) setUsePoints(false);
            }}
          >
            {useCredit ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Charge to Account
              </>
            ) : "Charge to Account"}
          </Button>
        )}
        
        {canUsePoints && !isClientBlocked && (
          <Button 
            variant={usePoints ? "default" : "outline"} 
            size="sm" 
            className="w-full"
            onClick={() => {
              setUsePoints(!usePoints);
              if (!usePoints) setUseCredit(false);
            }}
          >
            {usePoints ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Redeem {Math.floor(amount / 0.01) > clientPoints ? clientPoints : Math.floor(amount / 0.01)} Points
              </>
            ) : `Redeem Points (${formatCurrency(Math.min(pointsWorth, amount))})`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientInfo;
