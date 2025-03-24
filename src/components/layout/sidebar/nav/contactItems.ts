
import { Contact } from "lucide-react";
import { NavItem } from "./index";

export const contactItems: NavItem[] = [
  {
    title: "Contacts",
    path: "/contacts",
    icon: Contact,
    roles: ["admin", "manager"]
  }
];
