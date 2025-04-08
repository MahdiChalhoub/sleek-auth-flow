
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockRoles } from "@/models/role";
import RoleCard from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

const Roles: React.FC = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { containerClass, cardLayout, gridColumns } = useResponsiveLayout();
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

  // Filter roles based on search term
  const filteredRoles = searchTerm
    ? roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : roles;

  return (
    <div className={containerClass}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold">User Roles</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[200px]"
            />
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
      </div>
      
      <div className={
        cardLayout === 'compact' 
          ? "space-y-4"
          : cardLayout === 'list'
          ? "flex flex-col gap-5"
          : `grid ${gridColumns} gap-4 md:gap-6`
      }>
        {filteredRoles.length > 0 ? (
          filteredRoles.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEditRole}
              onView={handleViewRole}
              onDelete={handleDeleteRole}
              compact={cardLayout === 'compact'}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-2">No roles found</p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;
