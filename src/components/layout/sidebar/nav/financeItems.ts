
import { DollarSign, CreditCard } from "lucide-react";
import { NavItem } from "./index";

export const financeItems: NavItem[] = [
  {
    title: "Dépenses",
    path: "/transaction-permissions",
    icon: DollarSign,
    roles: ["admin"]
  },
  {
    title: "Comptes de paiement",
    path: "/register-sessions",
    icon: CreditCard,
    roles: ["admin", "manager"]
  }
];
