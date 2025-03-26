
import { DollarSign, CreditCard, ReceiptText, Wallet, PiggyBank, FileText } from "lucide-react";
import { NavItem } from "./index";

export const financeItems: NavItem[] = [
  {
    title: "Caisse Enregistreuse",
    path: "/register",
    icon: ReceiptText,
    roles: ["admin", "manager", "cashier"],
    children: [
      {
        title: "Caisse",
        path: "/register",
        icon: ReceiptText,
        roles: ["admin", "manager", "cashier"]
      },
      {
        title: "Sessions",
        path: "/register-sessions", 
        icon: FileText,
        roles: ["admin", "manager"]
      }
    ]
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: Wallet,
    roles: ["admin", "manager"]
  },
  {
    title: "Dépenses",
    path: "/transaction-permissions",
    icon: DollarSign,
    roles: ["admin"]
  },
  {
    title: "Finance Personnel",
    path: "/staff-finance",
    icon: PiggyBank,
    roles: ["admin", "manager"]
  }
];
