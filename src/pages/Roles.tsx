
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockRoles } from "@/models/role";
import RoleCard from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const Roles: React.FC = () => {
  const [roles, setRoles] = useState(mockRoles);
  const navigate = useNavigate();
  const { containerClass, cardLayout } = useResponsiveLayout();
  const isMobile = useIsMobile();

  const handleViewRole = (roleId: string) => {
    navigate(`${ROUTES.ROLES}?role=${roleId}`);
  };

  const handleEditRole = (roleId: string) => {
    navigate(`${ROUTES.ROLES}?role=${roleId}&edit=true`);
  };

  const handleDeleteRole = (roleId: string) => {
    // Just show a simple confirm dialog for now
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold">User Roles</h1>
        </div>
        
        <Button 
          onClick={() => navigate(ROUTES.ROLES)}
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          {isMobile ? "New" : "Create New Role"}
        </Button>
      </div>
      
      <div className={
        cardLayout === 'compact' 
          ? "space-y-4"
          : cardLayout === 'list'
          ? "flex flex-col gap-5"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      }>
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={handleEditRole}
            onView={handleViewRole}
            onDelete={handleDeleteRole}
            compact={cardLayout === 'compact'}
          />
        ))}
      </div>
    </div>
  );
};

export default Roles;
