
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockRoles } from "@/models/role";
import RoleCard from "@/components/RoleCard";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const Roles: React.FC = () => {
  const [roles, setRoles] = useState(mockRoles);
  const navigate = useNavigate();

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
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">User Roles</h1>
        </div>
        
        <Button onClick={() => navigate(ROUTES.ROLES)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={handleEditRole}
            onView={handleViewRole}
            onDelete={handleDeleteRole}
          />
        ))}
      </div>
    </div>
  );
};

export default Roles;
