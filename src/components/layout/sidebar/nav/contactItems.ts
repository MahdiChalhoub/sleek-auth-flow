
import { Contact, Users } from "lucide-react";
import { NavItem } from "./index";

export const contactItems: NavItem[] = [
  {
    title: "Clients",
    path: "/clients", // Updated path to point directly to /clients
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
