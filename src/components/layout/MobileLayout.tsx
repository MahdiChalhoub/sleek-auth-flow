
import React from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import MobileHeader from "./mobile/MobileHeader";
import MobileBottomNav from "./mobile/MobileBottomNav";
import { useScreenSize } from "@/hooks/use-mobile";

const MobileLayout: React.FC = () => {
  const { isMobile } = useScreenSize();
  const location = useLocation();

  if (!isMobile) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <MobileHeader />
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default MobileLayout;
