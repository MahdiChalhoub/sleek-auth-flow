
import { Mail, Settings } from "lucide-react";
import { NavItem } from "./index";

export const settingsItems: NavItem[] = [
  {
    title: "Modèles de notification",
    path: "/notifications",
    icon: Mail,
    roles: ["admin"]
  },
  {
    title: "Paramètres",
    path: "/settings",
    icon: Settings,
    roles: ["admin"]
  }
];
