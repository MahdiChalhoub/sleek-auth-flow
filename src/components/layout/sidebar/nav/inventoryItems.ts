
import { Package, Tags, Ruler } from "lucide-react";
import { NavItem } from "./index";

export const inventoryItems: NavItem[] = [
  {
    title: "Produits",
    path: "/inventory",
    icon: Package,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Inventaire",
        path: "/inventory",
        icon: Package,
        roles: ["admin", "manager"]
      },
      {
        title: "Catégories",
        path: "/categories",
        icon: Tags,
        roles: ["admin", "manager"]
      },
      {
        title: "Unités",
        path: "/units",
        icon: Ruler,
        roles: ["admin", "manager"]
      }
    ]
  }
];
