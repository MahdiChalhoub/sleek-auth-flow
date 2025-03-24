
import { Package } from "lucide-react";
import { NavItem } from "./index";

export const inventoryItems: NavItem[] = [
  {
    title: "Produits",
    path: "/inventory",
    icon: Package,
    roles: ["admin", "manager"]
  }
];
