
import { Contact, Users } from "lucide-react";
import { NavItem } from "./index";
import { ROUTES } from "@/constants/routes";

export const contactItems: NavItem[] = [
  {
    title: "Clients",
    path: ROUTES.CLIENTS,
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
