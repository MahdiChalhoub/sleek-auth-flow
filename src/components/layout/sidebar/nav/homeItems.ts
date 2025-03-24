
import { Home } from "lucide-react";
import { NavItem } from "./index";

export const homeItems: NavItem[] = [
  {
    title: "Accueil",
    path: "/home",
    icon: Home,
    roles: ["admin", "manager", "cashier"]
  }
];
