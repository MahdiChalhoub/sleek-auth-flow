
import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarFooter from "./sidebar/SidebarFooter";

const AppSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
