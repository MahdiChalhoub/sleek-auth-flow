
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TransactionStatusBadge from "@/components/TransactionStatusBadge";
import { Transaction } from "@/models/transaction";
import { BookOpen, Edit, Lock, Unlock, CheckCircle, ShieldCheck, Trash2 } from "lucide-react";

interface TransactionsListProps {
  transactions: Transaction[];
  onViewLedger: (transaction: Transaction) => void;
  onChangeStatus: (transactionId: string, newStatus: "open" | "locked" | "verified" | "secure") => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onViewLedger,
  onChangeStatus,
  onDeleteTransaction
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer">
              <div className="flex items-center">
                Date
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <TransactionStatusBadge status={transaction.status} />
                </TableCell>
                <TableCell>{transaction.createdBy}</TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsList;
