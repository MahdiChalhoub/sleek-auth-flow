
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawerMenu from "../MobileDrawerMenu";

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/home": "Dashboard",
    "/pos-sales": "POS Sales",
    "/inventory": "Inventory",
    "/purchase-orders": "Purchase Orders",
    "/returns": "Returns",
    "/settings": "Settings",
    "/register": "Register",
    "/register-sessions": "Register Sessions",
    "/transactions": "Transactions",
    "/transaction-permissions": "Transaction Permissions",
    "/suppliers": "Suppliers",
    "/stock-transfers": "Stock Transfers",
    "/staff-finance": "Staff Finance",
    "/loyalty": "Loyalty & Rewards",
    "/categories": "Category Management",
    "/shift-reports": "Shift Reports",
    "/audit-trail": "Audit Trail",
    "/users": "User Management",
  };
  
  return routes[pathname] || "POS System";
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
