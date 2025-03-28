
import { ArrowUpCircle, ShoppingCart, Gift, RotateCcw } from "lucide-react";
import { NavItem } from "./index";

export const salesItems: NavItem[] = [
  {
    title: "Ventes",
    path: "/sales",
    icon: ArrowUpCircle,
    roles: ["admin", "manager", "cashier"],
    children: [
      {
        title: "Factures",
        path: "/pos/sales",
        icon: ShoppingCart,
        roles: ["admin", "cashier", "manager"]
      },
      {
        title: "Clients",
        path: "/clients",
        icon: Gift,
        roles: ["admin", "manager", "cashier"]
      },
      {
        title: "Retours",
        path: "/returns",
        icon: RotateCcw,
        roles: ["admin", "cashier", "manager"]
      }
    ]
  }
];
