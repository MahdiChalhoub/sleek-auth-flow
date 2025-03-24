
import { BarChart3, Receipt, Clock, History } from "lucide-react";
import { NavItem } from "./index";

export const reportItems: NavItem[] = [
  {
    title: "Rapports",
    path: "/reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Transactions",
        path: "/transactions",
        icon: Receipt,
        roles: ["admin", "manager"]
      },
      {
        title: "Shift Reports",
        path: "/shift-reports",
        icon: Clock,
        roles: ["admin", "manager"]
      },
      {
        title: "Audit Trail",
        path: "/audit-trail",
        icon: History,
        roles: ["admin"]
      }
    ]
  }
];
