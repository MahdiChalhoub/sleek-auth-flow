
import { DollarSign, CreditCard, ReceiptText } from "lucide-react";
import { NavItem } from "./index";

export const financeItems: NavItem[] = [
  {
    title: "Caisse enregistreuse",
    path: "/register",
    icon: ReceiptText,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Sessions de caisse",
    path: "/register-sessions",
    icon: CreditCard,
    roles: ["admin", "manager"]
  },
  {
    title: "Dépenses",
    path: "/transaction-permissions",
    icon: DollarSign,
    roles: ["admin"]
  }
];
