
import { Package, Tags, Ruler, Barcode, CalendarClock, Package2 } from "lucide-react";
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
        title: "Gestion des Emballages",
        path: "/packaging-management",
        icon: Package2,
        roles: ["admin", "manager"]
      },
      {
        title: "Impression de Codes-barres",
        path: "/barcode-printing",
        icon: Barcode,
        roles: ["admin", "manager"]
      },
      {
        title: "Gestion des Expirations",
        path: "/expiration-management",
        icon: CalendarClock,
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
