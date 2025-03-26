
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionStatus } from "@/models/transaction";
import { BookOpen, Edit, Lock, Unlock, CheckCircle, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SecurityCheckDialog from "@/components/POS/SecurityCheckDialog";

interface TransactionActionsProps {
  transaction: Transaction;
  onViewLedger: (transaction: Transaction) => void;
  onChangeStatus: (transactionId: string, newStatus: TransactionStatus) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({
  transaction,
  onViewLedger,
  onChangeStatus,
  onDeleteTransaction
}) => {
  const { hasPermission } = useAuth();
  const [securityAction, setSecurityAction] = useState<'lock' | 'unlock' | 'verify' | 'delete' | null>(null);
  
  const handleSecurityCheck = (action: 'lock' | 'unlock' | 'verify' | 'delete') => {
    setSecurityAction(action);
  };
  
  const handleConfirmAction = () => {
    if (!securityAction) return;
    
    switch (securityAction) {
      case 'lock':
        onChangeStatus(transaction.id, "locked");
        break;
      case 'unlock':
        onChangeStatus(transaction.id, "open");
        break;
      case 'verify':
        onChangeStatus(transaction.id, "verified");
        break;
      case 'delete':
        onDeleteTransaction(transaction.id);
        break;
    }
    
    setSecurityAction(null);
  };
  
  // Map permissions to transaction status actions
  const getRequiredPermission = (action: string): string => {
    const permissionMap: Record<string, string> = {
      view: "can_view_transactions",
      edit: "can_edit_transactions",
      lock: "can_lock_transactions",
      unlock: "can_unlock_transactions",
      verify: "can_verify_transactions",
      delete: "can_delete_transactions",
      secure: "can_secure_transactions",
      unverify: "can_unverify_transactions"
    };
    
    return permissionMap[action] || "";
  };
  
  return (
    <>
      <div className="flex justify-end items-center gap-1">
        {/* View Ledger - Available for all statuses if user has view permission */}
        {hasPermission(getRequiredPermission("view")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onViewLedger(transaction)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="View Ledger Entries"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
        
        {/* Transaction editing - only available for open transactions */}
        {transaction.status === "open" && hasPermission(getRequiredPermission("edit")) && (
          <Button 
            variant="ghost" 
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Edit Transaction"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {/* Lock transaction - available for open transactions */}
        {transaction.status === "open" && hasPermission(getRequiredPermission("lock")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleSecurityCheck("lock")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Lock Transaction"
          >
            <Lock className="h-4 w-4" />
          </Button>
        )}
        
        {/* Unlock transaction - available for locked transactions */}
        {transaction.status === "locked" && hasPermission(getRequiredPermission("unlock")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleSecurityCheck("unlock")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Unlock Transaction"
          >
            <Unlock className="h-4 w-4" />
          </Button>
        )}
        
        {/* Verify transaction - available for locked transactions */}
        {transaction.status === "locked" && hasPermission(getRequiredPermission("verify")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleSecurityCheck("verify")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Verify Transaction"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        
        {/* Secure transaction - available for verified transactions */}
        {transaction.status === "verified" && hasPermission(getRequiredPermission("secure")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "secure")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Secure Transaction"
          >
            <ShieldCheck className="h-4 w-4" />
          </Button>
        )}
        
        {/* Unverify transaction - available for verified transactions */}
        {transaction.status === "verified" && hasPermission(getRequiredPermission("unverify")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "unverified")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Mark as Unverified"
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        )}
        
        {/* Delete transaction - available for all except secure transactions */}
        {transaction.status !== "secure" && hasPermission(getRequiredPermission("delete")) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleSecurityCheck("delete")}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            title="Delete Transaction"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Security Check Dialog */}
      <SecurityCheckDialog
        isOpen={securityAction !== null}
        onClose={() => setSecurityAction(null)}
        onConfirm={handleConfirmAction}
        actionType={securityAction === 'delete' ? 'delete' : securityAction === 'verify' ? 'verify' : 'lock'}
        requiredPermission={securityAction ? getRequiredPermission(securityAction) : undefined}
      />
    </>
  );
};

export default TransactionActions;
