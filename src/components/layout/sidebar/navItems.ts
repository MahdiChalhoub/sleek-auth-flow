
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  RotateCcw, 
  Settings, 
  Users,
  CreditCard,
  Repeat,
  FileText,
  ShieldCheck,
  BarChart3,
  DollarSign,
  Gift,
  Briefcase,
  Bell,
  Clock,
  History,
  Tag
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Home",
    path: "/home",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "POS Sales",
    path: "/pos-sales",
    icon: ShoppingCart,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Register",
    path: "/register",
    icon: CreditCard,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Register Sessions",
    path: "/register-sessions",
    icon: FileText,
    roles: ["admin", "manager"]
  },
  {
    title: "Shift Reports",
    path: "/shift-reports",
    icon: Clock,
    roles: ["admin", "manager"]
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: Repeat,
    roles: ["admin", "manager"]
  },
  {
    title: "Transaction Permissions",
    path: "/transaction-permissions",
    icon: ShieldCheck,
    roles: ["admin"]
  },
  {
    title: "Staff Finance",
    path: "/staff-finance",
    icon: Briefcase,
    roles: ["admin", "manager"]
  },
  {
    title: "Loyalty & Rewards",
    path: "/loyalty",
    icon: Gift,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: Package,
    roles: ["admin", "manager"]
  },
  {
    title: "Categories",
    path: "/categories",
    icon: Tag,
    roles: ["admin", "manager"]
  },
  {
    title: "Suppliers",
    path: "/suppliers",
    icon: Users,
    roles: ["admin", "manager"]
  },
  {
    title: "Purchase Orders",
    path: "/purchase-orders",
    icon: ClipboardList,
    roles: ["admin", "manager"]
  },
  {
    title: "Stock Transfers",
    path: "/stock-transfers",
    icon: Repeat,
    roles: ["admin", "manager"]
  },
  {
    title: "Returns",
    path: "/returns",
    icon: RotateCcw,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Audit Trail",
    path: "/audit-trail",
    icon: History,
    roles: ["admin"]
  },
  {
    title: "Role Management",
    path: "/roles",
    icon: Users,
    roles: ["admin"]
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin"]
  }
];
