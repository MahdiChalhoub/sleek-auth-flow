
import { Truck, Scale, Box, BarChart2 } from "lucide-react";
import { NavItem } from "./index";

export const stockItems: NavItem[] = [
  {
    title: "Transferts de stock",
    path: "/stock-transfers",
    icon: Truck,
    roles: ["admin", "manager"]
  },
  {
    title: "Ajustement des stocks",
    path: "/stock-adjustments",
    icon: Scale,
    roles: ["admin", "manager"]
  },
  {
    title: "Unités",
    path: "/units",
    icon: Box,
    roles: ["admin", "manager"]
  },
  {
    title: "Catégories",
    path: "/categories",
    icon: BarChart2,
    roles: ["admin", "manager"]
  }
];
