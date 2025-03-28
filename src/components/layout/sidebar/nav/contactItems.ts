
import { Contact, Users } from "lucide-react";
import { NavItem } from "./index";

export const contactItems: NavItem[] = [
  {
    title: "Clients",
    path: "/clients",
    icon: Contact,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Fidélité",
    path: "/loyalty",
    icon: Users,
    roles: ["admin", "manager"]
  }
];
