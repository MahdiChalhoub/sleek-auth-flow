
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { ROUTES } from "@/constants/routes";

const MobileHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === ROUTES.HOME || 
                    location.pathname === '/';

  const getPageTitle = (): string => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Convert kebab-case to Title Case
    if (!lastSegment) return "Dashboard";
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b bg-background px-4">
      {!isRootPath ? (
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-4/5">
            <MobileSidebar />
          </SheetContent>
        </Sheet>
      )}
      
      <h1 className="text-lg font-medium flex-1">
        {getPageTitle()}
      </h1>
      
      <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.NOTIFICATIONS)}>
        <Bell className="h-5 w-5" />
      </Button>
    </header>
  );
};

export default MobileHeader;
