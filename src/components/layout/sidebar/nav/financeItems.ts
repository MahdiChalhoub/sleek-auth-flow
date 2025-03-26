
import { DollarSign, CreditCard, ReceiptText, Wallet, PiggyBank, FileText, BarChart3, BookOpen, FileSpreadsheet, Scale } from "lucide-react";
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
    title: "Comptabilité",
    path: "/ledger",
    icon: BookOpen,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Grand Livre",
        path: "/ledger",
        icon: BookOpen,
        roles: ["admin", "manager"]
      },
      {
        title: "Comptes Clients",
        path: "/accounts-receivable",
        icon: FileSpreadsheet,
        roles: ["admin", "manager"]
      },
      {
        title: "Comptes Fournisseurs",
        path: "/accounts-payable",
        icon: FileSpreadsheet,
        roles: ["admin", "manager"]
      },
      {
        title: "Profit & Pertes",
        path: "/profit-loss",
        icon: Scale,
        roles: ["admin", "manager"]
      }
    ]
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
  },
  {
    title: "Sauvegarde & Restauration",
    path: "/backup-restore",
    icon: FileText,
    roles: ["admin"]
  }
];
