
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Transaction, LedgerEntry } from "@/models/transaction";

interface TransactionLedgerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  ledgerEntries: LedgerEntry[];
}

const TransactionLedgerDialog: React.FC<TransactionLedgerDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  ledgerEntries
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Journal Entries</DialogTitle>
          <DialogDescription>
            Double-entry ledger records for transaction {transaction.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p>{transaction.description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p>${transaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Method:</span>
                  <p className="capitalize">{transaction.paymentMethod}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Ledger Entries</h3>
              <Table className="mt-1">
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="capitalize">{entry.accountType.replace('_', ' ')}</TableCell>
                      <TableCell>{entry.isDebit ? `$${entry.amount.toFixed(2)}` : ""}</TableCell>
                      <TableCell>{!entry.isDebit ? `$${entry.amount.toFixed(2)}` : ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Created by {transaction.createdBy} on {new Date(transaction.createdAt).toLocaleString()}</p>
              {transaction.status === "verified" && transaction.verifiedBy && (
                <p>Verified by {transaction.verifiedBy} on {new Date(transaction.verifiedAt || "").toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionLedgerDialog;
