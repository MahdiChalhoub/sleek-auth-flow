
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
  Clock,
  History,
  Tag,
  Home,
  UserCircle,
  Contact,
  TruckDelivery,
  Scale,
  Receipt,
  UserCheck,
  Building,
  Mail,
  ArrowDownCircle,
  ArrowUpCircle,
  UserCog
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    title: "Accueil",
    path: "/home",
    icon: Home,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Gestion des utilisateurs",
    path: "/users",
    icon: UserCircle,
    roles: ["admin"],
    children: [
      {
        title: "Utilisateurs",
        path: "/users",
        icon: Users,
        roles: ["admin"]
      },
      {
        title: "Les rôles",
        path: "/roles",
        icon: ShieldCheck,
        roles: ["admin"]
      },
      {
        title: "Agents de la Commission",
        path: "/staff-finance",
        icon: UserCog,
        roles: ["admin", "manager"]
      }
    ]
  },
  {
    title: "Contacts",
    path: "/contacts",
    icon: Contact,
    roles: ["admin", "manager"]
  },
  {
    title: "Produits",
    path: "/inventory",
    icon: Package,
    roles: ["admin", "manager"]
  },
  {
    title: "Achats",
    path: "/purchase",
    icon: ArrowDownCircle,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Commandes",
        path: "/purchase-orders",
        icon: ClipboardList,
        roles: ["admin", "manager"]
      },
      {
        title: "Fournisseurs",
        path: "/suppliers",
        icon: Building,
        roles: ["admin", "manager"]
      },
      {
        title: "Réceptions",
        path: "/stock-transfers",
        icon: TruckDelivery,
        roles: ["admin", "manager"]
      }
    ]
  },
  {
    title: "Ventes",
    path: "/sales",
    icon: ArrowUpCircle,
    roles: ["admin", "manager", "cashier"],
    children: [
      {
        title: "Factures",
        path: "/pos-sales",
        icon: ShoppingCart,
        roles: ["admin", "cashier", "manager"]
      },
      {
        title: "Clients",
        path: "/loyalty",
        icon: Gift,
        roles: ["admin", "manager", "cashier"]
      },
      {
        title: "Retours",
        path: "/returns",
        icon: RotateCcw,
        roles: ["admin", "cashier", "manager"]
      }
    ]
  },
  {
    title: "Transferts de stock",
    path: "/stock-transfers",
    icon: TruckDelivery,
    roles: ["admin", "manager"]
  },
  {
    title: "Ajustement des stocks",
    path: "/categories",
    icon: Scale,
    roles: ["admin", "manager"]
  },
  {
    title: "Dépenses",
    path: "/transaction-permissions",
    icon: DollarSign,
    roles: ["admin"]
  },
  {
    title: "Comptes de paiement",
    path: "/register-sessions",
    icon: CreditCard,
    roles: ["admin", "manager"]
  },
  {
    title: "Rapports",
    path: "/reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
    children: [
      {
        title: "Transactions",
        path: "/transactions",
        icon: Receipt,
        roles: ["admin", "manager"]
      },
      {
        title: "Shift Reports",
        path: "/shift-reports",
        icon: Clock,
        roles: ["admin", "manager"]
      },
      {
        title: "Audit Trail",
        path: "/audit-trail",
        icon: History,
        roles: ["admin"]
      }
    ]
  },
  {
    title: "Modèles de notification",
    path: "/notifications",
    icon: Mail,
    roles: ["admin"]
  },
  {
    title: "Paramètres",
    path: "/settings",
    icon: Settings,
    roles: ["admin"]
  }
];
