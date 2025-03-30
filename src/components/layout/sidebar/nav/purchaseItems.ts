
import { ArrowDownCircle, ClipboardList, Building, Truck, AlertTriangle, BarChart4 } from "lucide-react";
import { NavItem } from "./index";

export const purchaseItems: NavItem[] = [
  {
    title: "Achats",
    path: "/purchase",
    icon: ArrowDownCircle,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Commandes",
        path: "/purchase-orders",
        icon: ClipboardList,
        roles: ["admin", "manager"]
      },
      {
        title: "Demandes",
        path: "/purchase-requests",
        icon: AlertTriangle,
        roles: ["admin", "manager"]
      },
      {
        title: "Fournisseurs",
        path: "/suppliers",
        icon: Building,
        roles: ["admin", "manager"]
      },
      {
        title: "Réceptions",
        path: "/stock-transfers",
        icon: Truck,
        roles: ["admin", "manager"]
      },
      {
        title: "Analyse",
        path: "/purchase-analytics",
        icon: BarChart4,
        roles: ["admin", "manager"]
      }
    ]
  }
];
