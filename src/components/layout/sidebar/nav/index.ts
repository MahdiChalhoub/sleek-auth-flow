
import React from "react";
import { homeItems } from "./homeItems";
import { userItems } from "./userItems";
import { contactItems } from "./contactItems";
import { inventoryItems } from "./inventoryItems";
import { purchaseItems } from "./purchaseItems";
import { salesItems } from "./salesItems";
import { stockItems } from "./stockItems";
import { financeItems } from "./financeItems";
import { reportItems } from "./reportItems";
import { settingsItems } from "./settingsItems";

export interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  ...homeItems,
  ...userItems,
  ...contactItems,
  ...inventoryItems,
  ...purchaseItems,
  ...salesItems,
  ...stockItems,
  ...financeItems,
  ...reportItems,
  ...settingsItems
];
