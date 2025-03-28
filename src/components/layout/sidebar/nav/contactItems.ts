
import { Contact, Users } from "lucide-react";
import { NavItem } from "./index";

export const contactItems: NavItem[] = [
  {
    title: "Clients",
    path: "/contacts",
    icon: Contact,
    roles: ["admin", "manager"]
  },
  {
    title: "Fidélité",
    path: "/loyalty",
    icon: Users,
    roles: ["admin", "manager"]
  }
];
