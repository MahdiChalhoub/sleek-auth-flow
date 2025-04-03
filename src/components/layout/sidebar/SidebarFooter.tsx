
import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider"; // Updated import path
import { 
  SidebarFooter as Footer, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

const SidebarFooter: React.FC = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <Footer className="mt-auto p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Logout"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Footer>
  );
};

export default SidebarFooter;
