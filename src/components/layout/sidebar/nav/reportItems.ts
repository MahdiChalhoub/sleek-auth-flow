
import { BarChart3, Receipt, Clock, History, FileSpreadsheet, Download, FileText, Activity } from "lucide-react";
import { NavItem } from "./index";

export const reportItems: NavItem[] = [
  {
    title: "Tableau de Bord",
    path: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    title: "Rapports",
    path: "/reports",
    icon: FileSpreadsheet,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Transactions",
        path: "/transactions",
        icon: Receipt,
        roles: ["admin", "manager"]
      },
      {
        title: "Rapports de Shift",
        path: "/shift-reports",
        icon: Clock,
        roles: ["admin", "manager"]
      },
      {
        title: "Journal d'Activité",
        path: "/audit-trail",
        icon: History,
        roles: ["admin"]
      },
      {
        title: "Activité Utilisateurs",
        path: "/user-activity",
        icon: Activity,
        roles: ["admin", "manager"]
      },
      {
        title: "Exports",
        path: "/exports",
        icon: Download,
        roles: ["admin", "manager"]
      }
    ]
  }
];
