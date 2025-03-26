
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawerMenu from "../MobileDrawerMenu";

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/home": "Dashboard",
    "/dashboard": "Tableau de Bord",
    "/pos-sales": "Ventes POS",
    "/inventory": "Inventaire",
    "/purchase-orders": "Commandes d'Achat",
    "/returns": "Retours",
    "/settings": "Paramètres",
    "/register": "Caisse Enregistreuse",
    "/register-sessions": "Sessions de Caisse",
    "/transactions": "Transactions",
    "/transaction-permissions": "Permissions de Transaction",
    "/suppliers": "Fournisseurs",
    "/stock-transfers": "Transferts de Stock",
    "/staff-finance": "Finance Personnel",
    "/loyalty": "Programme de Fidélité",
    "/categories": "Gestion des Catégories",
    "/shift-reports": "Rapports de Shift",
    "/audit-trail": "Journal d'Activité",
    "/user-activity": "Activité Utilisateurs",
    "/users": "Gestion des Utilisateurs",
    "/contacts": "Contacts",
    "/notifications": "Notifications",
    "/ledger": "Grand Livre",
    "/accounts-receivable": "Comptes Clients",
    "/accounts-payable": "Comptes Fournisseurs",
    "/profit-loss": "Profit & Pertes",
    "/backup-restore": "Sauvegarde & Restauration",
    "/exports": "Exports",
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
