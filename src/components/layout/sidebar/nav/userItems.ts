
import { UserCircle, Users, ShieldCheck, UserCog, FileText } from "lucide-react";
import { NavItem } from "./index";

export const userItems: NavItem[] = [
  {
    title: "Gestion des utilisateurs",
    path: "/users",
    icon: UserCircle,
    roles: ["admin"],
    children: [
      {
        title: "Utilisateurs",
        path: "/users",
        icon: Users,
        roles: ["admin"]
      },
      {
        title: "Les rôles",
        path: "/roles",
        icon: ShieldCheck,
        roles: ["admin"]
      },
      {
        title: "Gestion des rôles",
        path: "/role-management",
        icon: ShieldCheck,
        roles: ["admin"]
      },
      {
        title: "Agents de la Commission",
        path: "/staff-finance",
        icon: UserCog,
        roles: ["admin", "manager"]
      },
      {
        title: "Rôles Financiers",
        path: "/staff-finance-roles",
        icon: FileText,
        roles: ["admin", "manager"]
      }
    ]
  }
];
