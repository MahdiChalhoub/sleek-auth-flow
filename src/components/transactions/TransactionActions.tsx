
import React from "react";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionStatus } from "@/models/transaction";
import { BookOpen, Edit, Lock, Unlock, CheckCircle, ShieldCheck, Trash2 } from "lucide-react";

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
  return (
    <div className="flex justify-end items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onViewLedger(transaction)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        title="View Ledger Entries"
      >
        <BookOpen className="h-4 w-4" />
      </Button>
      
      {transaction.status === "open" && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "locked")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "locked")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Lock className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {transaction.status === "locked" && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "open")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Unlock className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "verified")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {transaction.status === "verified" && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "locked")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Lock className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onChangeStatus(transaction.id, "secure")}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShieldCheck className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {transaction.status !== "secure" && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDeleteTransaction(transaction.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TransactionActions;
