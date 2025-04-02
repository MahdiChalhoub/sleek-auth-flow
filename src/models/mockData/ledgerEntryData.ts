
import { LedgerEntry } from "../transaction";

export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: "le1",
    transactionId: "tx1",
    accountType: "Cash",
    amount: 100,
    isDebit: true,
    description: "Cash payment",
    createdAt: new Date().toISOString(),
    createdBy: "System"
  },
  {
    id: "le2",
    transactionId: "tx1",
    accountType: "Sales Revenue",
    amount: 100,
    isDebit: false,
    description: "Sales revenue",
    createdAt: new Date().toISOString(),
    createdBy: "System"
  },
  {
    id: "le3",
    transactionId: "tx2",
    accountType: "Cash",
    amount: 200,
    isDebit: false,
    description: "Purchase payment",
    createdAt: new Date().toISOString(),
    createdBy: "System"
  },
  {
    id: "le4",
    transactionId: "tx2",
    accountType: "Expenses",
    amount: 200,
    isDebit: true,
    description: "Office supplies",
    createdAt: new Date().toISOString(),
    createdBy: "System"
  }
];
