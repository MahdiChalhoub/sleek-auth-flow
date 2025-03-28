
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawerMenu from "../MobileDrawerMenu";
import { ROUTES } from "@/constants/routes";

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    [ROUTES.HOME]: "Dashboard",
    [ROUTES.DASHBOARD]: "Tableau de Bord",
    [ROUTES.POS_SALES]: "Ventes POS",
    [ROUTES.INVENTORY]: "Inventaire",
    [ROUTES.PURCHASE_ORDERS]: "Commandes d'Achat",
    [ROUTES.RETURNS]: "Retours",
    [ROUTES.SETTINGS]: "Paramètres",
    [ROUTES.REGISTER]: "Caisse Enregistreuse",
    [ROUTES.REGISTER_SESSIONS]: "Sessions de Caisse",
    [ROUTES.TRANSACTIONS]: "Transactions",
    [ROUTES.TRANSACTION_PERMISSIONS]: "Autorisations de Dépenses",
    [ROUTES.SUPPLIERS]: "Fournisseurs",
    [ROUTES.STOCK_TRANSFERS]: "Transferts de Stock",
    [ROUTES.STOCK_ADJUSTMENTS]: "Ajustements de Stock",
    [ROUTES.STAFF_FINANCE]: "Finance Personnel",
    [ROUTES.LOYALTY]: "Programme de Fidélité",
    [ROUTES.CATEGORIES]: "Gestion des Catégories",
    [ROUTES.UNITS]: "Gestion des Unités",
    [ROUTES.SHIFT_REPORTS]: "Rapports de Shift",
    [ROUTES.AUDIT_TRAIL]: "Journal d'Activité",
    [ROUTES.USER_ACTIVITY]: "Activité Utilisateurs",
    [ROUTES.USERS]: "Gestion des Utilisateurs",
    [ROUTES.CONTACTS]: "Gestion des Clients",
    [ROUTES.NOTIFICATIONS]: "Notifications",
    [ROUTES.LEDGER]: "Grand Livre",
    [ROUTES.GENERAL_LEDGER]: "Grand Livre",
    [ROUTES.ACCOUNTS_RECEIVABLE]: "Comptes Clients",
    [ROUTES.ACCOUNTS_PAYABLE]: "Comptes Fournisseurs",
    [ROUTES.PROFIT_LOSS]: "Profit & Pertes",
    [ROUTES.BACKUP_RESTORE]: "Sauvegarde & Restauration",
    [ROUTES.EXPORTS]: "Exports de Données",
    [ROUTES.EXPENSES]: "Gestion des Dépenses",
    [ROUTES.RECURRING_EXPENSES]: "Dépenses Récurrentes",
    [ROUTES.PACKAGING_MANAGEMENT]: "Gestion des Emballages",
    [ROUTES.BARCODE_PRINTING]: "Impression de Codes-barres",
    [ROUTES.EXPIRATION_MANAGEMENT]: "Gestion des Expirations",
    [ROUTES.ROLES]: "Gestion des Rôles",
  };
  
  return routes[pathname] || "Système POS";
};

const PageTitle: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <div className="flex items-center gap-2">
      <MobileDrawerMenu>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </MobileDrawerMenu>
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
    </div>
  );
};

export default PageTitle;
