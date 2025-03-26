
import { Truck, Scale } from "lucide-react";
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
  }
];
