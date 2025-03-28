
import {
  BanknotesIcon,
  CreditCardIcon,
  ArrowPathIcon,
  CalendarIcon,
  ReceiptPercentIcon,
  RocketLaunchIcon,
  ChartBarIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const financeItems = [
  {
    title: "Finance Dashboard",
    path: ROUTES.DASHBOARD,
    icon: ChartBarIcon,
    roles: ["admin", "manager"],
  },
  {
    title: "Transactions",
    path: ROUTES.TRANSACTIONS,
    icon: BanknotesIcon,
    roles: ["admin", "manager", "cashier"],
  },
  {
    title: "Staff Finance",
    path: ROUTES.STAFF_FINANCE,
    icon: CreditCardIcon,
    roles: ["admin", "manager"],
  },
  {
    title: "Expenses",
    path: ROUTES.EXPENSES,
    icon: ReceiptPercentIcon,
    roles: ["admin", "manager"],
  },
  {
    title: "Recurring Expenses",
    path: ROUTES.RECURRING_EXPENSES,
    icon: ArrowPathIcon,
    roles: ["admin", "manager"],
  },
  {
    title: "Financial Years",
    path: ROUTES.FINANCIAL_YEARS,
    icon: CalendarIcon,
    roles: ["admin"],
  },
  {
    title: "Transaction Permissions",
    path: ROUTES.TRANSACTION_PERMISSIONS,
    icon: RocketLaunchIcon,
    roles: ["admin"],
  },
];
